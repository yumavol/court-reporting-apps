export class HealthService {
  check() {
    return { status: 'good', time: new Date().toISOString() };
  }
}
