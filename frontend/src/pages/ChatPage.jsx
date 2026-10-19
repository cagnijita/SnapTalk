import React from 'react'
import { useChatStore } from "../store/useChatStore.js";
import ProfileHeader from '../components/ProfileHeader.jsx';
import ActiveTabSwitch from '../components/ActiveTabSwitch.jsx';
import ChatsList from '../components/ChatsList.jsx';
import ContactList from '../components/ContactList.jsx';
import ChatContainer from '../components/ChatContainer.jsx';
import NoConversationPlaceholder from '../components/NoConversationPlaceholder.jsx';
import BorderAnimatedContainer from '../components/BorderAnimatedContainer.jsx';

const ChatPage = () => {
  const { activeTab,selectedUser } = useChatStore();
// console.log(selectedUser)
  return (
      <div className="flex items-center justify-center w-full bg-transparent min-h-screen p-4">
      <BorderAnimatedContainer>
         <div className="flex flex-row w-full h-full min-h-0 overflow-hidden">
        {/* Left side */}
        <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
          <ProfileHeader />
          <ActiveTabSwitch />
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        {/* Right Side */}
        <div className='flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm'>
        {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
        </div>
      </BorderAnimatedContainer>
    </div>
  )
}

export default ChatPage
