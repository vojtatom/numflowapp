#!/bin/python3
import gc
import json
import os
import asyncio
from concurrent.futures import ThreadPoolExecutor
import websockets
import sys
from threading import Condition, Event, Thread
from numflow.application import Application
from numflow.write import printOK, printImport

HOST = '0.0.0.0'
PORT_RECIEVE = 9003

_executor = ThreadPoolExecutor(10)

app = Application()

async def in_thread(func, params):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(_executor, func, params)

async def serve(websocket, path):
    printOK("starting connection {}".format(websocket))
    

    while True:
        data = await websocket.recv()
        data = json.loads(data)
        printImport(data)
        
        #response = app.process(data)
        response = await asyncio.gather(
            in_thread(app.process, data)
        )

        response = json.dumps(response[0])
        printOK("respons {}".format(response))
        
        await websocket.send(response)

start_server = websockets.serve(serve, HOST, PORT_RECIEVE)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
