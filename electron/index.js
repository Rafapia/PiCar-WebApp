document.onkeydown = updateKey;
document.onkeyup = resetKey;

var server_port = 65432;
var server_addr = "192.168.10.140";   // the IP address of your Raspberry PI

function client(input = ""){
    const net = require('net');
    const client = net.createConnection({ port: server_port, host: server_addr }, () => {
        // 'connect' listener.
        console.log('connected to server!');
        // send the message
        client.write(`${input}\r\n`);
    });
    
    // get the data from the server
    client.on('data', (data) => {
        const json_data = JSON.parse(data);
        document.getElementById("movement").innerHTML = json_data.movement;
        document.getElementById("speed").innerHTML = json_data.curr_speed;
        document.getElementById("temperature").innerHTML = json_data.cpu_temp;
        document.getElementById("grayscale").innerHTML = json_data.grayscale;

        // document.getElementById("bluetooth").innerHTML = data;
        console.log(json_data.toString());
        client.end();
        client.destroy();
    });

    client.on('end', () => {
        console.log('disconnected from server');
    });


}

// for detecting which key is been pressed w,a,s,d
function updateKey(e) {

    e = e || window.event;

    if (e.keyCode == '87') {
        // up (w)
        document.getElementById("upArrow").style.color = "green";
        client("forward");
    }
    else if (e.keyCode == '83') {
        // down (s)
        document.getElementById("downArrow").style.color = "green";
        client("backward");
    }
    else if (e.keyCode == '65') {
        // left (a)
        document.getElementById("leftArrow").style.color = "green";
        client("left");
    }
    else if (e.keyCode == '68') {
        // right (d)
        document.getElementById("rightArrow").style.color = "green";
        client("right");
    }
}

// reset the key to the start state 
function resetKey(e) {

    e = e || window.event;

    document.getElementById("upArrow").style.color = "grey";
    document.getElementById("downArrow").style.color = "grey";
    document.getElementById("leftArrow").style.color = "grey";
    document.getElementById("rightArrow").style.color = "grey";
    client("stop")
}


// update data for every 50ms
function update_data() {
    setInterval(function(){
        // get image from python server
        client();
    }, 50);
}
