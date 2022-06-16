import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IAgoraRTCClient, ILocalVideoTrack } from 'agora-rtc-sdk-ng';
import { AgoraServiceService } from '../agora-service.service';

@Component({
  selector: 'app-joining-page',
  templateUrl: './joining-page.component.html',
  styleUrls: ['./joining-page.component.css']
})
export class JoiningPageComponent implements OnInit {
  
  @ViewChild('user') user: HTMLElement; 
  videotrack: ILocalVideoTrack;

  constructor(private agoraservice: AgoraServiceService) { }
  async startcall(){
    // console.warn(this.user);
    
    await this.agoraservice.startcall(this.user)
    console.log('user-joined');
    
    await this.agoraservice.RemoteUser()
    console.log('user-remote');
    

    
    
   
    

  }

  async leavecall(){
    await this.agoraservice.leavecall()
    console.log('leave call');
    
  }
  ngOnInit(): void {
  }

}
