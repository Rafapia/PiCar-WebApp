import socket
import picar_4wd as fc
import json
from gpiozero import CPUTemperature

HOST = "192.168.10.140" # IP address of your Raspberry PI
PORT = 65432          # Port to listen on (non-privileged ports are > 1023)

speed = 40
curr_speed = 0
movement = "STOP"
cpu = CPUTemperature()

def make_response(cpu_temp = 40):

    return {
        'movement': movement,
        'cpu_temp': f"{cpu.temperature}°C",
        'curr_speed': curr_speed,
        'grayscale': fc.get_grayscale_list(),
    }

def control_car(data):
    global curr_speed, movement

    if (data == "forward"):
        fc.forward(speed)
        curr_speed = speed
        movement = "FORWARD"

    elif (data == "backward"):
        fc.backward(speed)
        curr_speed = -speed
        movement = "BACKWARD"

    elif (data == "right"):
        fc.turn_right(speed)
        curr_speed = speed
        movement = 'TURNING RIGHT'

    elif (data == "left"):
        fc.turn_left(speed)
        curr_speed = speed
        movement = "TURNING LEFT"

    elif (data == "stop"):
        fc.stop()
        curr_speed = 0
        movement = "STOP"

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind((HOST, PORT))
    s.listen()

    try:
        while 1:
            client, clientInfo = s.accept()
            print("server recv from: ", clientInfo)
            data = client.recv(1024)      # receive 1024 Bytes of message in binary format
            if data != b"":
                print(data)
                data = data.decode('ascii')

                control_car(data[:-2])

                data_out = json.dumps(make_response()).encode('ascii')
                print(data_out)
                client.sendall(data_out)
                
                # client.sendall(data.encode('ascii')) # Echo back to client
    except: 
        print("Closing socket")
        client.close()
        s.close()