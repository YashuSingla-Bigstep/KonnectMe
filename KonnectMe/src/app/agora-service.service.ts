import { ElementRef, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import AgoraRTC, { IAgoraRTCClient, ILocalAudioTrack, ILocalVideoTrack } from 'agora-rtc-sdk-ng';

@Injectable({
  providedIn: 'root'
})
export class AgoraServiceService {
  
  client: IAgoraRTCClient = AgoraRTC.createClient({
    mode: 'rtc',
    codec: 'vp8',
  });
  AgoraAppId= '4cfb2aa4550349a58d4e46530d261a68'
  ChannelName= 'Demoproject'
  AgoraToken= '0064cfb2aa4550349a58d4e46530d261a68IACVhsp0iarpL1RB1eJ0GT+MyR2SRVpAHdSayk7ScQ0EnsHP4CwAAAAAEAC5bVGztASsYgEAAQC0BKxi'
  private localVideoTrack: ILocalVideoTrack;
  private localAudioTrack: ILocalAudioTrack;
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
      this.renderer = rendererFactory.createRenderer(null, null);
  }

  async startcall(user: HTMLElement){
    try{
      const uid = await this.client.join(this.AgoraAppId, this.ChannelName, this.AgoraToken)
      this.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
      this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      await this.client.publish([this.localAudioTrack, this.localVideoTrack]);
      //this.localVideoTrack.play('user');
      
      console.warn(uid);
      this.localVideoTrack.play('user')
    } catch(error){
      console.log(error);
    }
  }

  async RemoteUser(){
    try{
      console.log('entered in Remote User');
      
      this.client.on("user-published", async (user, mediaType) => {
        console.log(user);
        
        await this.client.subscribe(user,mediaType);
        console.log('subscribe Successfully');
        if(mediaType === "video"){
          const RvideoTrack = user.videoTrack;
          console.log(this.renderer);
          const RemoteuserCard: HTMLDivElement = await this.renderer.createElement('div');
          const usercard = document.getElementById('remoteUser');
          console.log(usercard);
          this.renderer.setAttribute(RemoteuserCard, 'id', user.uid.toString());
          this.renderer.setStyle(RemoteuserCard, 'height', '500px');
          this.renderer.setStyle(RemoteuserCard, 'width', '500px');
          console.log('height-fixed',user);
          
          this.renderer.appendChild(usercard, RemoteuserCard);
          RvideoTrack.play(RemoteuserCard);
        }
      })
    }catch(error){
      console.log(error);
      
    }
    

  }

  async leavecall(){
    this.localAudioTrack.close()
    this.localVideoTrack.close();
    const removeCard = document.getElementById(this.client.uid.toString());
    const usercard = document.getElementById('remoteUser');
    this.renderer.removeChild(usercard, removeCard)
    await this.client.leave()
    console.warn('client-leaved')
  }
}
