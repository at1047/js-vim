// const app = () => {
//   window.userInput = document.getElementById("userInput");
//   terminalOutput = document.getElementById("terminalOutput");
//   document.getElementById("dummyKeyboard").focus();
// };

// document.querySelector('#app').innerHTML = ``

const app = document.getElementById('app');
const columns = 70;
const rows = 33;
const fontSize = 16;
var buffer
var cursorBuffer
var visualBuffer
const tabSpaces = 4;
var marked;
var fontWidth
var fontHeight


// mode switching!!!
// 0: command mode
// 1: insert mode
var mode = 0;

const emptyBufRow = new Array(columns).fill(' ')
const emptyCursor = new Array(rows);
for (var i = 0; i < rows; i++) {
  emptyCursor[i] = new Array(columns+1).fill(false);
}
// const dirMap = {
//   1: 'left',
//   2: ''
// }

const getTextWidth = () => {
  
  const text = document.createElement("pre");
  document.body.appendChild(text);

  text.style.font = "Roboto Mono";
  text.style.fontSize = fontSize + "px";
  text.style.height = 'auto';
  text.style.width = 'auto';
  text.style.position = 'absolute';
  text.style.whiteSpace = 'no-wrap';
  text.innerHTML = 'HelloWorld\nHelloWorld\nHelloWorld\nHelloWorld\nHelloWorld';

  const width = Math.ceil(text.clientWidth);
  fontWidth = width/10;
  document.body.removeChild(text);
}

window.onload = (event) => {
  console.log("page is fully loaded");
  getTextWidth()
  app.style.width = (columns+1)*fontWidth + 'px';
  app.style.fontSize = fontSize + 'px';

  buffer = new Array(rows);
  for (var i = 0; i < rows; i++) {
    buffer[i] = new Array(columns).fill(' ');
  }
  visualBuffer = new Array(rows);
  for (var i = 0; i < rows; i++) {
    visualBuffer[i] = new Array(columns).fill(false);
  }
  cursorBuffer = new Array(rows);
  // cursor buffer needs one more
  for (var i = 0; i < rows; i++) {
    cursorBuffer[i] = new Array(columns+1).fill(false);
  }
  cursorBuffer[0][0] = true;

  const str = 'Testing 123! these are a list of words!';
  for (var j = 0; j < str.length; j++) {
    buffer[0][j] = str[j];
  }
  render()
  // console.log(findCursor())
};

const render = () => {
  var t = '';
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns+1; j++) {
      if (j === columns) {
        if (cursorBuffer[i][j]) {
          t += '<mark id="cursor"> </mark>';
        } else {
          t += ' '
        }
      } else if (cursorBuffer[i][j]) {
        t += '<mark id="cursor">';
        t += buffer[i][j];
        t += '</mark>';
      } else {
        t += buffer[i][j];
      }
    }
    t += "\n";
  }
  app.innerHTML = t;
  console.log(t)
  cursor = document.getElementById('cursor')
  console.log(cursor)

  if (mode === 0) {
    cursor.classList.remove("blinking")

  } else if (mode === 1) {
    cursor.classList.add("blinking")
  }

  // buffer.forEach((row) => {
  //   row.forEach((cell) => {
  //     if 
  //     t += cell;
  //   });
  //   t += "\n";
  // });
  // app.innerHTML = t;
}




// for (let i = 0; i < buffer.length; i++) {
//   var row = buffer[i]
//   for (let j = 0; j < row.length; j++) {
//     buffer[i][j] = 'e';
//   }
// }
const findCursor = () => {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns+1; j++) {
      if (cursorBuffer[i][j] === true) {
        return {i, j}
      }
    }
  }
  return null
}

const moveCursor = (dir, times) => {
  console.log(dir)
  console.log(findCursor())
  const {i, j} = findCursor()
  console.log({i, j})
  var [newi, newj] = [i, j];

  for (let i = 0; i < times; i++) {
    switch(dir) {
      case 'h':
        newi = newi
        newj = (newj - 1 >= 0 ? newj - 1 : newj)
        break;
      case 'j':
        newi = (newi + 1 < rows ? newi + 1 : newi)
        newj = newj
        break;
      case 'k':
        newi = (newi - 1 >= 0 ? newi - 1 : newi)
        newj = newj
        break;
      case 'l':
        newi = newi
        newj = (newj + 1 < columns+1 ? newj + 1 : newj)
        break;
    }
  }
  
  cursorBuffer[i][j] = false;
  cursorBuffer[newi][newj] = true;
}

const findNextWord = () => {
  /**
   * finds distance from next word
   */
  const {i, j} = findCursor()
  const currRow = buffer[i].slice(j);
  if (currRow.indexOf(' ') === -1) {
    return currRow.length
  }
  return currRow.indexOf(' ')

}

const findPrevWord = () => {
  const {i, j} = findCursor()
  var currRow = buffer[i].slice(0, j);
  currRow = currRow.reverse()
  console.log(currRow)
  var shift;
  if (currRow.indexOf(' ') === 0) {
    currRow.shift()
    console.log(currRow)
    if (currRow.indexOf(' ') === -1) {
      return currRow.length + 1
    } else {
      shift = currRow.indexOf(' ') + 1
    }
  } else {
    if (currRow.indexOf(' ') === -1) {
      return currRow.length
    } else {
      shift = currRow.indexOf(' ')

    }
  }
  return shift
}

const findLastWord = () => {
  const {i, j} = findCursor()
  const currRow = buffer[i].slice(j);
  var remString = currRow.join('')
  remString = remString.trimEnd()
  console.log(remString)
  return remString.length
}

const inputChar = (char) => {
  const {i, j} = findCursor();
  const currRow = buffer[i]
  console.log(`inputting ${char}`)
  console.log(currRow)
  if (currRow[currRow.length - 1] === ' ') {
    currRow.pop()
    currRow.splice(j, 0, char)
    buffer[i] = currRow
    moveCursor('l', 1)
  }
}

const deleteChar = (relIdx) => {
  const {i, j} = findCursor();
  var currRow = buffer[i]
  console.log(`element to remove: ${j}`)
  if (j !== 0) {
    currRow.splice(j+relIdx, 1);
    currRow.push(' ')
    console.log(`length: $${currRow.length}`)
    moveCursor('h', 1)
  }
}

const deleteLine = (relIdx) => {
  const {i, j} = findCursor();
  buffer.splice(i+relIdx, 1);
  buffer[rows-1] = new Array(columns).fill(' ');
  cursorBuffer[i+relIdx] = new Array(columns+1).fill(false);
  cursorBuffer[i+relIdx][0] = true
  moveCursor('k', 1)
}

const insertLine = (relIdx) => {
  const {i, j} = findCursor();

  if (rowEquals(buffer[rows-1], emptyBufRow)) {
    console.log("adding new line")
    buffer.pop()
    // if (i === 0) {
    //   buffer.
    // } else {
      buffer.splice(i+1+relIdx, 0, emptyBufRow)
      console.log(buffer)
    // }

  }
}

const goToRowStart = () => {
  const {i, j} = findCursor();
  cursorBuffer[i] = new Array(columns+1).fill(false)
  cursorBuffer[i][0] = true
}

const rowEquals = (array1, array2) => {
  return (array1.length === array2.length && array1.every(function(value, index) { return value === array2[index]}))
}

const isAscii = (keycode) => {
  var valid = 
    // (keycode > 47 && keycode < 58)   || // number keys
    // keycode == 32 || keycode == 13   || // spacebar & return key(s) (if you want to allow carriage returns)
    // (keycode > 64 && keycode < 91)   || // letter keys
    // (keycode > 95 && keycode < 112)  || // numpad keys
    // (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
    // (keycode > 218 && keycode < 223);   // [\]' (in order)
    (keycode >= 32 && keycode <= 126)

  return valid;
}


document.addEventListener('keypress', (event) => {
  var name = event.key;
  var code = event.keyCode;
  // Alert the key name and key code on keydown
  console.log({mode, name, code})
  switch(mode) {
    case 0:
      console.log("in command mode")
      commandFunctions(name)
      break;
    case 1:
      console.log("inputting char")
      if (isAscii(code)) {
        console.log("is ascii")
        inputChar(name)
      } else {
        switch(name) {
          case "Escape":
            mode = 0
            moveCursor('h', 1)
            break;
          case "Backspace":
            deleteChar(-1)
            break;
          case 'Enter':
            moveCursor('j', 1)

            goToRowStart()
            break;
        }

      }
      break;
    case 4:
      switch(name) {
        case 'd':
          deleteLine(0)
          mode = 0;
          break;
      }
  }

  render()
}, false);

document.onkeydown = function (t) {
  console.log(t)
  if(t.which == 9){
   return false;
  }
 }


const commandFunctions = (name) => {
  console.log(name)
  switch(name) {
    case 'h':
      moveCursor('h', 1)
      break;
    case 'j':
      moveCursor('j', 1)
      break;
    case 'k':
      moveCursor('k', 1)
      break;
    case 'l':
      moveCursor('l', 1)
      break;
    case 'w':
      // console.log(findNextWord())
      moveCursor('l', findNextWord()+1)
      break;
    case 'b':
      moveCursor('h', findPrevWord())
      break;
    case 'e':
      moveCursor('l', findNextWord()-1)
      break;
    case 'x':
      deleteChar(0)
      moveCursor('l', 1)
      break;
    case 'd':
      mode = 4
      break;
    case 'i':
      app.removeAttribute("disabled");
      mode = 1
      console.log(mode)
      break;
    case 'a':
      app.removeAttribute("disabled");
      mode = 1
      moveCursor('l', 1)
      console.log(mode)
      break;
    case 'A':
      app.removeAttribute("disabled");
      mode = 1
      moveCursor('l', findLastWord())
      console.log(mode)
      break;
    case 'o':
      insertLine(1)
      moveCursor('j', 1)
      goToRowStart()
      break;
    case 'O':
      insertLine(-1)
      // moveCursor('k', 1)
      goToRowStart()
      break;
    case 'Escape':
      app.setAttribute('disabled', 'disabled');
      mode = 0
      break;
    case 'Tab':
      moveCursor('l', 4)
      break;
  }
}


const clear = () => {
  for (let i = 0; i < buffer.length; i++) {
    var row = buffer[i]
    for (let j = 0; j < row.length; j++) {
      buffer[i][j] = ' ';
      zbuffer[i][j] = -99999;
    }
  }
  while (canvas.childNodes.length > 0) {
    canvas.removeChild(canvas.firstChild);
  }
}