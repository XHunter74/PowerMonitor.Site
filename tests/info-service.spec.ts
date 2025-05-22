import { InfoService } from '../src/app/services/info-service';
import { AuthService } from '../src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('InfoService', () => {
  let service: InfoService;
  let http: any;
  let authService: any;

  beforeEach(() => {
    http = {
      get: jest.fn(),
      post: jest.fn(),
    };
    authService = {};
    service = new InfoService(http as unknown as HttpClient, authService as AuthService, null as any);
  });

  it('should call http.get for getSystemInfo', (done) => {
    http.get.mockReturnValue(of({}));
    service.getSystemInfo().subscribe(result => {
      expect(http.get).toHaveBeenCalledWith(
        expect.stringContaining('info/sysinfo'),
        expect.objectContaining({ params: expect.any(Object) })
      );
      done();
    });
  });

  it('should call http.post for pingApi', (done) => {
    http.post.mockReturnValue(of({}));
    service.pingApi().subscribe(result => {
      expect(http.post).toHaveBeenCalledWith(
        expect.stringContaining('info/ping'),
        null,
        expect.any(Object)
      );
      done();
    });
  });

  it('should call http.get for getBoardVersion', (done) => {
    http.get.mockReturnValue(of({}));
    service.getBoardVersion().subscribe(result => {
      expect(http.get).toHaveBeenCalledWith(
        expect.stringContaining('info/board-build-date'),
        expect.objectContaining({ params: expect.any(Object) })
      );
      done();
    });
  });
});
