import React, { RefObject } from 'react';
import './AppHeader.css';
import { IActivityService, ActivityService } from '../../services/ActivityService';
import { GoogleBtn } from '../GoogleButton';

interface AppHeaderProps {
  invokeRefresh : () => Promise<void>;
  headerDescription: string;
  clientId: string;
}

class AppHeader extends React.Component<AppHeaderProps, any> {

    private async importFiles() : Promise<void> {
      if (!this.inputOpenFileRef.current) {
        console.log(`fileuploader null so I'm returning early`)
        return;
      }
      this.inputOpenFileRef.current.click();
    }
  
    private async fileChosen(event: any) : Promise<void> {
      if (!this.inputOpenFileRef.current) {
        console.log(`fileuploader null so I'm returning early`)
        return;
      }
      if (!this.inputOpenFileRef.current.files) {
        console.log(`no files selected, returning early`);
      }
      const fileList: FileList | null = this.inputOpenFileRef.current.files;
      if (!fileList) {
        console.log(`no files selected (2), returning early`);
        return;
      }

      let failedFiles : string[] = [];
      console.log(`going to upload ${fileList.length} files`)
      for(let i = 0; i < fileList.length; i++) {
        
        let file = fileList.item(i);
        if (!file) {
          console.log(`file at ${i} is null`)
          continue;
        }

        try {
          await this.activityService.uploadActivity(file);
        } 
        catch (error) {
          failedFiles.push(file.name);
        }
      }

      if (failedFiles.length > 0) {
        for(const f of failedFiles) {
          console.log(`FAILED: ${f}`);
        }
      }

      await this.props.invokeRefresh();
    }

    render() {
      return (
      <div className="App-header">
        <div className="Header-Description">
          <h2>RunStats.JS</h2>
          <label className="Description-Label">{this.props.headerDescription}</label>
        </div>
        <div className="Button-Table">
          <GoogleBtn clientId={this.props.clientId} invokeRefresh={this.props.invokeRefresh}></GoogleBtn>
          <div className="Centerized-tablecell">
            <input ref={this.inputOpenFileRef} type="file" accept=".gpx" multiple style={{display:"none"}} onChange={this.fileChosen.bind(this)}/>
            <button className="Import-button" onClick={() => this.importFiles()}>Import File(s)</button>
          </div>
        </div>
      </div>)
    }


    private readonly inputOpenFileRef : RefObject<HTMLInputElement>
    private readonly activityService : IActivityService;

    constructor(props: any) {
      super(props);

      this.inputOpenFileRef = React.createRef()
      this.activityService = new ActivityService();

    }
  }
  
  export default AppHeader;