import React, { RefObject } from 'react';
import './AppHeader.css';

class AppHeader extends React.Component {

    private async importFiles() : Promise<void> {
      if (!this.inputOpenFileRef.current) {
        console.log(`fileuploader null so I'm returning early`)
        return;
      }
      await this.inputOpenFileRef.current.click();
      if (!this.inputOpenFileRef.current.files) {
        console.log(`no files selected, returning early`);
      }
      const fileList: FileList | null = this.inputOpenFileRef.current.files;
      if (!fileList) {
        console.log(`no files selected (2), returning early`);
        return;
      }
      console.log(`going to upload ${fileList.length} files`)
      for(let i = 0; i < fileList.length; i++) {
        
        let file = fileList.item(i);
        if (!file) {
          console.log(`file at ${i} is null`)
          continue;
        }
        console.log(file.name);

        
      }
    }
  
    render() {
      return (
      <div className="App-header">
        <div>
          <h2>RunStats.JS</h2>
        </div>
        <div className="Button-Table">
          <div className="Button-container">
          <input ref={this.inputOpenFileRef} type="file" accept=".gpx" multiple style={{display:"none"}}/>
            <button className="Import-button" onClick={() => this.importFiles()}>Import File(s)</button>
          </div>
        </div>
      </div>)
    }


    private readonly inputOpenFileRef : RefObject<HTMLInputElement>
  
    constructor(props: any) {
      super(props);

      this.inputOpenFileRef = React.createRef()
    }
  }
  
  export default AppHeader;