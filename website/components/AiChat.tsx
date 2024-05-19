"use client"
import React from 'react'
import {ChatBox} from "find-x-react";

const AiChat = ({secret}:{secret: string}) => {
  return (
    <ChatBox secret={secret}/>
  )
}

export default AiChat