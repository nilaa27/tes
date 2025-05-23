
let test = new Speedtest();

function start(){
  test.onupdate = data => {
    document.getElementById("download").textContent = data.dlStatus + " Mbps";
    document.getElementById("upload").textContent = data.ulStatus + " Mbps";
    document.getElementById("ping").textContent = data.pingStatus + " ms";
  };
  test.onend = () => {};
  test.start();
}

/*!
 * Lightweight Speedtest worker (client-side only)
 * Source: LibreSpeed simplified version
 */
class Speedtest{
  constructor(){
    this._worker = new Worker("speedtest_worker.min.js");
    this._worker.onmessage = e => {
      if (e.data === "done") this.onend();
      else this.onupdate(e.data);
    };
  }
  start(){ this._worker.postMessage("start"); }
  onupdate(data){} onend(){}
}
