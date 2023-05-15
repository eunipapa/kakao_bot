# 카카오봇 Client 접속용 UDP Server

import socket
import json
import traceback

class UDPServer:
    def __init__(self, ip_address, port):
        self.ip_address = ip_address
        self.port = port

    def start(self):
        # Create a UDP socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

        sock.setsockopt(socket.SOL_SOCKET, socket.SO_SNDBUF, 4096)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF, 4096)

        sock.bind((self.ip_address, self.port))

        print(f"Server listening on {self.ip_address}:{self.port}")

        # Loop forever, listening for incoming datagrams
        while True:
            data, address = sock.recvfrom(4096)
            print(f"Received {len(data)} bytes from {address}")
            print(f"Received data : {data.decode()}")

            # Handle the incoming data with the FastAPI endpoint function

            response = self.handle_data(data)

            # Send the response back to the client
            print(f"Sent {response} bytes back to {address}")
            sock.sendto(response.encode(), address)


    def handle_data(self, data):
        # Implement your business logic here
        # This example just uppercases the input data

        try:
            obj = json.loads(data.decode())

            event = obj['event']
            room = obj['data']['room']
            content = obj['data']['content']
            print(event, room, content)

            
            obj['event'] = 'response'
            obj['data']['rescon'] = content + ' From UDP Server by python'

        except :
            traceback.print_exc()
            obj = data.decode()

        return json.dumps(obj)


udpServer = UDPServer('0.0.0.0', 9050)
udpServer.start()
