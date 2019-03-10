import { AsyncTimerEvent } from '../coordination/AsyncTimerEvent';

export class Task {
  /**
   * Blocks the current execution for the specified number of milliseconds. Equivalent to Task.Delay() in C#.
   * @param millisecondsDelay Number of milliseconds to delay
   */
  public static delay(millisecondsDelay: number): Promise<void> {
    let event = new AsyncTimerEvent(millisecondsDelay);
    return event.waitAsync();
  }

  /**
   * Executes a lambda function asynchronously. Equivalent to the proposed but never implemented setImmediate()
   * function in JavaScript.
   * @param lambda Lambda function to execute
   */
  public static run(lambda: Lambda): void {
    // window.postMessage() is the fastest method according to http://ajaxian.com/archives/settimeout-delay
    readyTasks.push(lambda);
    window.postMessage(eventData, '*');
  }
}

type Lambda = () => void;
const eventData = '@ls/cl/T.r'; // Any unique string. Abbreviated version of "@leosingleton/commonlibs-ts/Task.run"
let readyTasks: Lambda[] = [];

window.addEventListener('message', event => {
  if (event.data === eventData) {
    event.stopPropagation();
    while (readyTasks.length > 0) {
      let lambda = readyTasks.shift();
      try {
        lambda();
      } catch (err) {
        console.log(err);
      }
    }
  }
}, true);
