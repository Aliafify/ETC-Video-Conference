import React, {useEffect, useState,useRef} from 'react';
import Peer from 'peerjs';


const App = () => {
  
  // const myId = 'kjf'
  const [myId,setMyId] = useState(null)
  const [otherId,setOtherId] = useState(null);
  const [myStream,setMyStream] =useState(null);
  const [calls,setCalls] = useState({});
  const [myCall,setMyCall] = useState(null)
  const currentStream = useRef({});
  const otherStream = useRef({});
  const peerInstance =useRef()
  const peer = myId?new Peer(myId):new Peer()
//---------

  var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  //----------
  useEffect(()=>{
//  createStream();
 peer.on('open' ,(id)=>{
  console.log('peer id is: ', id)
  setMyId(id)
 })
//  peer.on('connection', function(conn) {
//   console.log(conn.peer,conn.open,conn.reiable,conn.serialization,conn.type,)
//  });

 peer.on('call', function(call) {
	// Answer the call, providing our mediaStream
  getUserMedia({ video: true, audio: true }, (mediaStream) => {
  
    currentStream.current.srcObject=mediaStream;
    currentStream.current.play()
    call.answer(mediaStream);
    
    call.on('stream', function(stream) {
      otherStream.current.srcObject=stream;
      otherStream.current.play()
      });
  })
  });
  peerInstance.current = peer;

},[])
  // console.log(myCall,'calls')
 
// call function 
function callUser(){ 
  getUserMedia({ video: true, audio: true }, (mediaStream) => {
  
    currentStream.current.srcObject=mediaStream;
    currentStream.current.play()
    var call = peerInstance.current.call(otherId,mediaStream);
    
    call.on('stream', function(stream) {
      otherStream.current.srcObject=stream;
      otherStream.current.play()
      console.log('called')
      });
  })
}
//---start Connection---
function startConnection(){
  
   const conn= peer.connect(otherId);
   conn.on('open', function() {
    // Receive messages
    conn.send({res:'Hello!'});
    conn.on('error', function(err) { console.log(err)});
    // Send messages
  });
  conn.on('data', function(data) {
    console.log('Received', data.res);
  });
    console.log(otherId,'other')
  

}
  return (
    <div >
      <video muted ref={currentStream} autoPlay width='300px' />
      <video muted ref={otherStream} autoPlay width='300px' />
      
      <input type='text' defaultValue={myId} placeholder='myid'/>
      <input type='text' onChange={(event)=>setOtherId(event.target.value)} placeholder='otherId'/>
      <button onClick={callUser}>call</button>

    </div>
  );
}

export default App;
