/**
 * Minuteur des phases du quizz, porté de Razzia
 * (https://github.com/Ralex91/Razzia) — licence MIT, Copyright (c) 2024 Ralex.
 *
 * `start(seconds)` se résout à l'échéance (ou immédiatement si `abort()`),
 * en émettant chaque seconde le compte restant via le callback `onTick`.
 * La promesse permet au moteur d'enchaîner les phases avec await.
 */
export class CooldownTimer {
  private active = false

  constructor(private readonly onTick: (remaining: number) => void) {}

  start(seconds: number): Promise<void> {
    if (this.active) {
      return Promise.resolve()
    }
    this.active = true
    let count = seconds - 1
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (!this.active || count <= 0) {
          this.active = false
          clearInterval(interval)
          resolve()
          return
        }
        this.onTick(count)
        count -= 1
      }, 1000)
    })
  }

  abort(): void {
    this.active &&= false
  }
}
