const prod=process.env['NODE_ENV'] == 'prod'

class prodLogger{
    static log(...args: any[]){
        console.log(...arguments)
    }
    static warn(...args: any[]){
        console.warn(...arguments)

    }
    static degug(...args: any[]){
    }
    static error(...args: any[]){
        console.error(...arguments)

    }
}


class devLogger {
    static log(...args: any[]) {
        console.log(...arguments)
    }
    static warn(...args: any[]){
        console.warn(...arguments)

    }
    static degug(...args: any[]){
        console.log(...arguments)
    }
    static error(...args: any[]){
        console.error(...arguments)

    }

}

export default (prod? prodLogger:devLogger)
