import HttpService from './http-service';
import {
  Nullable,
  AuthenticateRequest,
  AuthenticateResponse,
  APIError,
  User,
  MapResponse,
  DoActionRequest,
  DoActionResponse
} from '../models';

class GameService {
  private user: Nullable<User> = null;

  public authenticate(username: string): Promise<AuthenticateResponse> {
    return HttpService.put<AuthenticateResponse, AuthenticateRequest>(
      'authenticate', { username }
    ).then(
      (response: AuthenticateResponse) => {
        this.user = response.user;
        return response;
      }, (error: APIError) => {
        throw error;
      }
    )
  }

  public getMap(): Promise<MapResponse> {
    if (!this.user) {
      throw 'USER NOT FOUND';
    }

    return HttpService.get<MapResponse>(`entities/${this.user.token}`);
  }

  public doAction(request: DoActionRequest): Promise<DoActionResponse> {
    if (!this.user) {
      throw 'USER NOT FOUND';
    }

    return HttpService.put<DoActionResponse, DoActionRequest>(
      `do/${this.user.token}`, request
    );
  }
}

export default new GameService();

