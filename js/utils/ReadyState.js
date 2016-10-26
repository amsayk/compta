export default class {
  done = false;
  error = false;
  stale = false;
  aborted = false;

  onChange = ({ done, error, stale, aborted, }) => {
    this.done = done;
    this.error = error;
    this.stale = stale;
    this.aborted = aborted,
  };

  isDone = () => { return this.done; };
  isStale = () => { return this.stale; };
  isError = () => { return this.error; };
  isAborted = () => { return this.aborted; };
  isLoading = () => { return !this.done || this.stale; };
}
