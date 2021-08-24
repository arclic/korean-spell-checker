import axios, { AxiosInstance } from "axios";
import {
  axiosErrorType,
  requestQueryType,
  returnType,
  statusType,
} from "./common";

export default class koreanSpellCheckAPI {
  axiosInstance: AxiosInstance | null;
  axiosError: boolean | axiosErrorType;
  requestURL: string;
  constructor() {
    this.axiosError = false;
    this.requestURL =
      "https://m.search.naver.com/p/csearch/ocontent/util/SpellerProxy";
    try {
      this.axiosInstance = axios.create({
        timeout: 3000,
        headers: {
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36",
        },
      });
    } catch (error) {
      this.axiosError = axiosErrorType.instanceError;
      this.axiosInstance = null;
    }
  }

  async requestSpellCheck(message: string): Promise<returnType> {
    // 네이버는 최대 500자까지 검사 가능
    if (!message || message.length > 500) {
      this.axiosError = axiosErrorType.messageError;
    }

    if (this.axiosError) {
      return {
        status: statusType.error,
        error: this.handleErrorMessage(),
      };
    }

    try {
      const requestQuery: requestQueryType = {
        color_blindness: 0,
        q: message,
      };
      const response = await this.axiosInstance?.get<string>(this.requestURL, {
        params: requestQuery,
      });

      if (!response || response?.status !== 200 || !response.data) {
        throw new Error();
      }

      return {
        status: statusType.ok,
        data: response.data,
      };
    } catch (error) {
      this.axiosError = axiosErrorType.requestError;
      return {
        status: statusType.error,
        error: this.handleErrorMessage(),
      };
    }
  }

  handleErrorMessage(): string {
    switch (this.axiosError) {
      case axiosErrorType.instanceError:
        return "Instance를 생성하는 과정에서 에러가 발생했습니다.";
      case axiosErrorType.requestError:
        return "Request message를 보내는 과정에서 에러가 발생했습니다.";
      case axiosErrorType.messageError:
        return "맞춤법 검사하는 문장에 오류가 있습니다.";
      default:
        return "";
    }
  }
}
