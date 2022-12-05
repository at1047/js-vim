import { tabSpaces, rows, columns } from "./main"

export class TodoList {
    buffer;
    buffArr;
    indentArr;

    constructor(buffer) {
        this.buffer = buffer;
    }



    update(buffer) {
        this.buffer = buffer;
        this.readLines()
        console.log(this.buffArr)
        console.log(this.indentArr)
        this.convertToTodo()
        console.log(this.buffArr)
        this.buffer = this.writeToBuffer()
    }

    writeToBuffer() {
        var buffer = new Array(rows);
        for (var i = 0; i < rows; i++) {
            buffer[i] = new Array(columns).fill(' ');
        }
        for (var i = 0; i < this.buffArr.length; i++) {
            const lineArr = this.buffArr[i].split('')
            for (let j = 0; j < lineArr.length; j++) {
                buffer[i][j] = lineArr[j]
            }
        }
        return buffer
    }

    readLines() {
        this.buffArr = new Array(this.buffer.length)
        for (let i=0; i<this.buffArr.length;i++) {
            var t = this.buffer[i].join('')
            t = t.trimEnd()
            this.buffArr[i] = t
        }
        this.buffArr = this.buffArr.filter(line => line.length > 0)
        this.getIndentLevel()
        this.buffArr = this.buffArr.map(line => line.trimStart())
    }

    getIndentLevel() {
        this.indentArr = new Array(this.buffArr.length)
        for (let i=0; i<this.buffArr.length; i++) {
            this.indentArr[i] = this.buffArr[i].search(/\S|$/);
        }
    }

    convertToTodo() {
        const regex = /\[(x| )\]/;
        const isTodo = this.buffArr.map(x => x.search(regex) >= 0)
        console.log(isTodo)
        var bufferCopy = [...this.buffer]
        for (let i=0; i<this.buffArr.length; i++) {
                var prependingSpaces = ''
                for (let j = 0; j<this.indentArr[i]/2;j++) {
                    prependingSpaces = prependingSpaces + '  '
                }
            const todoPrepend = !isTodo[i] ? '[ ] ' : ''
            this.buffArr[i] = prependingSpaces + todoPrepend + this.buffArr[i]
        }

    }
}

