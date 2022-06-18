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
  AgoraToken= '0064cfb2aa4550349a58d4e46530d261a68IABjLdNaFFwrGhGGtOF9OrEvWgwAUcKF07Uf4RIdJ7LINcHP4CwAAAAAEACXhJCZHNGuYgEAAQAc0a5i'
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
      const userCard: HTMLDivElement = await this.renderer.createElement('div');
      this.renderer.setAttribute(userCard,'id', 'user')
      this.renderer.setStyle(userCard, 'height', '300px');
      this.renderer.setStyle(userCard, 'width', '300px');
      this.renderer.addClass(userCard, 'Loalvideo-card')
      const localcard = document.getElementById('localuser');
      this.renderer.appendChild(localcard, userCard)
      console.warn(uid);
      this.localVideoTrack.play(userCard)
      
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
          const Raudiotrack = user.audioTrack;
          console.log(this.renderer);
          const RemoteCard: HTMLDivElement = await this.renderer.createElement('div');
          const Remoteusercard = document.getElementById('remoteUser');
          this.renderer.setAttribute(RemoteCard, 'id', user.uid.toString());
          this.renderer.setStyle(RemoteCard, 'height', '300px');
          this.renderer.setStyle(RemoteCard, 'width', '300px');
          this.renderer.addClass(RemoteCard, 'Remotevideo-card')
          console.log('height-fixed',user);
          this.renderer.appendChild(Remoteusercard, RemoteCard);
          RvideoTrack.play(RemoteCard);
          Raudiotrack.play();
        }
      })
    }catch(error){
      console.log(error);
    }
  }

  async leavecall(){
    this.localAudioTrack.close()
    this.localVideoTrack.close();
    const localcard = document.getElementById('localuser')
    const usercard = document.getElementById('user');
    const Remotecard = document.getElementById('remoteUser')
    console.log(Remotecard);
    const RemoteChildern = document.getElementById("remoteUser").childNodes
    console.log(RemoteChildern)
    const copyRemoteChildern = Array.from(RemoteChildern)
    copyRemoteChildern.forEach(
      (currentValue)=>{
        console.log(currentValue, "Removed");
        this.renderer.removeChild(Remotecard, currentValue)
      }
    );
    this.renderer.removeChild(localcard,usercard);
    this.client.leave();
  }

  async remoteuserleave(){
    this.client.on('user-left', async(user,reason)=>{
      const Remotecard = document.getElementById('remoteUser');
      const remoteuserid = user.uid.toString();
      const remoteusercard = document.getElementById(remoteuserid);
      console.log(remoteuserid, remoteusercard);
      this.renderer.removeChild(Remotecard,remoteusercard)
    })
  }
}