interface UploadUrlRequest {
  expire_time: number;
  category_key?: string;
  title?: string;
  is_encryption_upload: number;
  is_audio_upload: number;
  is_passthrough: number;
  profile_key?: string;
  selected_profile_key?: string;
}

interface UploadUrlResponse {
  status: string;
  data?: {
    upload_url: string;
    progress_url: string;
    upload_file_key: string;
    expired_at: number;
  };
  error?: number;
  message?: string;
  result?: {
    upload_url: string;
    progress_url: string;
    upload_file_key: string;
    will_be_expired_at: number;
  };
}

interface UploadProgressResponse {
  error: number;
  result?: {
    progress: number;
    status: string;
  };
}

interface UploadFileResponse {
  result?: string;
  status?: string;
  success?: boolean;
  message?: string;
  error?: string;
}

class KollusUploadAPI {
  private accessToken: string;
  private baseUrl: string;

  constructor(accessToken: string, baseUrl: string = 'https://c-api-kr.kollus.com') {
    this.accessToken = accessToken;
    this.baseUrl = baseUrl;
  }

  /**
   * 업로드 URL을 생성합니다.
   */
  async createUploadUrl(params: {
    expireTime: number;
    categoryKey?: string;
    title?: string;
    uploadType: 'normal' | 'passthrough' | 'filelive';
    profileKey?: string;
  }): Promise<UploadUrlResponse> {
    const { expireTime, categoryKey, title, uploadType, profileKey } = params;

    // API URL 설정
    let apiUrl = `${this.baseUrl}/api/upload/create-url`;
    if (uploadType === 'passthrough' || uploadType === 'filelive') {
      apiUrl = 'https://upload.kr.kollus.com/api/v1/create_url';
    }

    // POST 데이터 구성
    const postData: UploadUrlRequest = {
      expire_time: expireTime,
      category_key: categoryKey,
      title: title,
      is_encryption_upload: 0,
      is_audio_upload: 0,
      is_passthrough: uploadType === 'passthrough' ? 1 : 0
    };

    // 패스쓰루 업로드시 profile_key 추가
    if (uploadType === 'passthrough') {
      if (!profileKey) {
        throw new Error('Profile Key는 패스쓰루 업로드시 필수입니다.');
      }
      postData.profile_key = profileKey;
    }

    // 파일라이브 업로드시 selected_profile_key 추가
    if (uploadType === 'filelive') {
      postData.selected_profile_key = categoryKey + '-filelive';
    }

    const formData = new FormData();
    Object.keys(postData).forEach(key => {
      if (postData[key as keyof UploadUrlRequest] !== undefined && postData[key as keyof UploadUrlRequest] !== '') {
        formData.append(key, String(postData[key as keyof UploadUrlRequest]));
      }
    });

    const response = await fetch(`${apiUrl}?access_token=${encodeURIComponent(this.accessToken)}`, {
      method: 'POST',
      body: formData
    });

    return await response.json();
  }

  /**
   * 파일을 업로드합니다.
   */
  async uploadFile(params: {
    uploadUrl: string;
    file: File;
    returnUrl?: string;
  }): Promise<UploadFileResponse> {
    const { uploadUrl, file, returnUrl } = params;

    const formData = new FormData();
    formData.append('upload-file', file);
    formData.append('disable_alert', '1');
    formData.append('accept', 'application/json');

    if (returnUrl) {
      formData.append('return_url', returnUrl);
      formData.append('redirection_scope', 'outer');
    }

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData
    });

    return await response.json();
  }

  /**
   * 업로드 진행률을 확인합니다.
   */
  async checkProgress(progressUrl: string): Promise<UploadProgressResponse> {
    const response = await fetch(progressUrl);
    return await response.json();
  }
}

/**
 * 파일 업로드 진행률을 모니터링하는 클래스
 */
class UploadProgressMonitor {
  private progressUrl: string;
  private intervalId?: number;
  private onProgress?: (progress: number) => void;
  private onComplete?: () => void;
  private onError?: (error: Error) => void;

  constructor(progressUrl: string) {
    this.progressUrl = progressUrl;
  }

  /**
   * 진행률 모니터링을 시작합니다.
   */
  start(params: {
    onProgress?: (progress: number) => void;
    onComplete?: () => void;
    onError?: (error: Error) => void;
    intervalMs?: number;
  }): void {
    const { onProgress, onComplete, onError, intervalMs = 1000 } = params;
    
    this.onProgress = onProgress;
    this.onComplete = onComplete;
    this.onError = onError;

    this.intervalId = setInterval(async () => {
      try {
        const response = await fetch(this.progressUrl);
        const result: UploadProgressResponse = await response.json();

        if (result.error === 0 && result.result) {
          const progress = result.result.progress;
          this.onProgress?.(progress);

          if (progress >= 100) {
            this.stop();
            this.onComplete?.();
          }
        }
      } catch (error) {
        this.stop();
        this.onError?.(error as Error);
      }
    }, intervalMs);
  }

  /**
   * 진행률 모니터링을 중지합니다.
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
}

/**
 * 유틸리티 함수들
 */
export class KollusUtils {
  /**
   * 만료 시간을 한국 시간으로 포맷팅합니다.
   */
  static formatExpireTime(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul'
    });
  }

  /**
   * 파일 크기를 읽기 쉬운 형태로 변환합니다.
   */
  static formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * 유효한 파일 타입인지 확인합니다.
   */
  static isValidFileType(file: File): boolean {
    // 지원하는 MIME 타입들
    const validMimeTypes = [
      // 비디오 파일
      'video/mp4', 'video/avi', 'video/mov', 'video/quicktime', 'video/wmv', 'video/flv',
      'video/webm', 'video/mkv', 'video/m4v', 'video/3gp', 'video/ts',
      'video/mts', 'video/m2ts', 'video/vob', 'video/ogv', 'video/asf',
      'video/rm', 'video/rmvb', 'video/dv', 'video/mxf', 'video/xvid',
      'video/x-msvideo', 'video/x-ms-wmv', 'video/x-flv', 'video/x-matroska',
      // 오디오 파일
      'audio/mp3', 'audio/wav', 'audio/aac', 'audio/ogg', 'audio/flac',
      'audio/m4a', 'audio/wma', 'audio/ra', 'audio/amr', 'audio/ape',
      'audio/opus', 'audio/webm', 'audio/mp4', 'audio/3gpp', 'audio/3gpp2',
      'audio/x-wav', 'audio/x-aiff', 'audio/x-m4a', 'audio/x-ms-wma'
    ];

    // 지원하는 파일 확장자들
    const validExtensions = [
      // 비디오 확장자
      '.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv', '.m4v',
      '.3gp', '.ts', '.mts', '.m2ts', '.vob', '.ogv', '.asf', '.rm',
      '.rmvb', '.dv', '.mxf', '.xvid', '.divx', '.f4v', '.f4p', '.f4a',
      '.f4b', '.m4b', '.m4p', '.m4r', '.m4v', '.3g2', '.3gp2', '.3gpp',
      '.3gpp2', '.3ga', '.3ga2', '.3gpa', '.3gpp2', '.3gpp3', '.3gpp4',
      // 오디오 확장자
      '.mp3', '.wav', '.aac', '.ogg', '.flac', '.m4a', '.wma', '.ra',
      '.amr', '.ape', '.opus', '.webm', '.mp4', '.3gpp', '.3gpp2', '.3ga',
      '.3ga2', '.3gpa', '.3gpp3', '.3gpp4', '.m4b', '.m4p', '.m4r', '.f4a',
      '.f4b', '.f4p', '.f4v', '.f4r', '.f4s', '.f4t', '.f4u', '.f4w',
      '.f4x', '.f4y', '.f4z'
    ];

    // MIME 타입 검증
    if (validMimeTypes.includes(file.type)) {
      return true;
    }

    // 파일 확장자 검증 (MIME 타입이 없는 경우)
    const fileName = file.name.toLowerCase();
    return validExtensions.some(ext => fileName.endsWith(ext));
  }
}

// 사용 예시
async function example() {
  try {
    const api = new KollusUploadAPI('your-access-token-here');

    // 1. 업로드 URL 생성
    const urlResponse = await api.createUploadUrl({
      expireTime: 600,
      categoryKey: 'your-category-key',
      title: '테스트 비디오',
      uploadType: 'normal'
    });

    if (urlResponse.error === 0 && urlResponse.result) {
      console.log('업로드 URL 생성 성공:', urlResponse.result.upload_url);

      // 2. 파일 업로드 (실제 파일이 있다고 가정)
      // const file = new File([''], 'test.mp4', { type: 'video/mp4' });
      // const uploadResponse = await api.uploadFile({
      //   uploadUrl: urlResponse.result.upload_url,
      //   file: file
      // });

      // 3. 진행률 모니터링
      const monitor = new UploadProgressMonitor(urlResponse.result.progress_url);
      monitor.start({
        onProgress: (progress) => {
          console.log(`업로드 진행률: ${progress}%`);
        },
        onComplete: () => {
          console.log('업로드 완료!');
        },
        onError: (error) => {
          console.error('업로드 오류:', error);
        }
      });
    }
  } catch (error) {
    console.error('API 호출 오류:', error);
  }
}

// 모듈 내보내기
export { KollusUploadAPI, UploadProgressMonitor };
export type { UploadUrlRequest, UploadUrlResponse, UploadProgressResponse, UploadFileResponse };
