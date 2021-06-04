import chalk from 'chalk'

const config = {
  INFO: { bgColor: 'bgCyan', textColor: 'white' },
  WARN: { bgColor: 'bgYellow', textColor: 'yellow' },
  SUCCESS: { bgColor: 'bgGreen', textColor: 'green' },
  ERROR: { bgColor: 'bgRed', textColor: 'red' },
}

type LogTypes = keyof typeof config

/**
 * ExConsole Class
 */
class ExConsole {
  public ExConsole = ExConsole
  constructor(private infoWidth = 9) {}

  info(message: string) {
    this.log('INFO', chalk[config.INFO.textColor](message))
  }

  warn(message: string) {
    this.log('WARN', chalk[config.WARN.textColor](message))
  }

  /**
   * 输出错误日志
   * @param message
   * @param showDetail 显示错误详情
   * @param exit 是否终止进程
   */
  error(message: string, error: false | Error = false, exit?: boolean) {
    this.log('ERROR', chalk[config.ERROR.textColor](message))

    if (error) {
      console.error(error)
    }

    if (exit) {
      process.exit()
    }
  }

  success(message: string) {
    this.log('SUCCESS', chalk[config.SUCCESS.textColor](message))
  }

  log(type: LogTypes, message: string) {
    const conf = config[type]
    const str = `[${this.getTimeStr()}] ${chalk.white[conf.bgColor].bold(this.center(type))} ${message}`

    console.log(str)
    return str
  }

  /**
   * 显示 loading 状态
   * 注意: 同步进程中 setInterval 会被阻塞
   * @param message
   * @returns
   */
  loading(message?: string) {
    const startTime = this.getTimeStr()
    const P = '=='

    let x = 0
    let back = false
    const max = this.infoWidth - 2 - P.length

    let twirlTimer = setInterval(() => {
      const stateStr = P.padStart(P.length + x, ' ').padEnd(this.infoWidth - 2, ' ')
      process.stdout.write(`\r[${startTime}] [${stateStr}] ${message}`)

      if (x >= max) {
        back = true
      } else if (x <= 0) {
        back = false
      }

      if (back) {
        x--
      } else {
        x++
      }
    }, 33)

    let stop = (stopMessage?: string, type: keyof typeof config = 'SUCCESS', exit?: boolean) => {
      const conf = config[type]
      const infoStr = `[${this.getTimeStr()}] ${chalk.white[conf.bgColor].bold(this.center(type))}`

      if (message) process.stdout.write('\r'.padEnd(infoStr.length + message.length, ' ')) // 清除历史信息
      process.stdout.write(`\r${infoStr} ${chalk[config[type].textColor](stopMessage)}`)
      process.stdout.write('\n')

      if (exit) process.exit()

      clearInterval(twirlTimer)

      // @ts-ignore
      twirlTimer = undefined
      // @ts-ignore
      stop = undefined
    }

    return stop
  }

  /**
   * 文本居中
   * @param str
   * @param width 总长度
   * @returns
   */
  center(str: string, width = this.infoWidth) {
    const lack = width - str.length

    if (lack <= 0) return str

    const offsetLeft = parseInt(String(lack / 2))
    const offsetRight = lack - offsetLeft

    return `${this.getSpaceStr(offsetLeft)}${str}${this.getSpaceStr(offsetRight)}`
  }

  getSpaceStr(count: number) {
    let str = ''
    for (let i = 0; i < count; i++) {
      str += ' '
    }
    return str
  }

  /**
   * 获取当前时间
   * @returns
   */
  getTimeStr() {
    const date = new Date()

    const obj = {
      H: date.getHours().toString().padStart(2, '0'),
      I: date.getMinutes().toString().padStart(2, '0'),
      S: date.getSeconds().toString().padStart(2, '0'),
      MS: date.getMilliseconds().toString().padStart(3, '0'),
    }

    return `${chalk.hex('#f78c6c')(`${obj.H}:${obj.I}:${obj.S}`)}.${chalk.hex('#b2ccd6')(obj.MS)}`
  }
}

export = new ExConsole()
