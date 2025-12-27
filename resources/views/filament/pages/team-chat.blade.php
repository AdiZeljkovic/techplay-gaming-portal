<x-filament-panels::page>
    <style>
        .team-chat-container {
            display: flex;
            height: calc(100vh - 200px);
            min-height: 500px;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .chat-sidebar {
            width: 280px;
            background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
            border-right: 1px solid rgba(255, 255, 255, 0.05);
            display: flex;
            flex-direction: column;
        }

        .sidebar-header {
            padding: 20px;
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .sidebar-header-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .sidebar-logo {
            width: 44px;
            height: 44px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
        }

        .sidebar-logo svg {
            width: 22px;
            height: 22px;
            color: white;
        }

        .sidebar-title {
            font-weight: 700;
            color: white;
            font-size: 14px;
        }

        .sidebar-status {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            color: #34d399;
        }

        .status-dot {
            width: 8px;
            height: 8px;
            background: #34d399;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {

            0%,
            100% {
                opacity: 1;
            }

            50% {
                opacity: 0.5;
            }
        }

        .search-container {
            padding: 16px;
        }

        .search-input {
            width: 100%;
            padding: 10px 16px 10px 40px;
            background: rgba(30, 41, 59, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            color: white;
            font-size: 13px;
            outline: none;
            transition: all 0.2s;
        }

        .search-input:focus {
            border-color: rgba(99, 102, 241, 0.5);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .search-input::placeholder {
            color: #64748b;
        }

        .channels-section {
            flex: 1;
            overflow-y: auto;
            padding: 0 12px;
        }

        .section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 8px;
        }

        .section-title {
            font-size: 10px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .add-channel-btn {
            width: 24px;
            height: 24px;
            background: rgba(51, 65, 85, 0.5);
            border: none;
            border-radius: 8px;
            color: #64748b;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }

        .add-channel-btn:hover {
            background: rgba(99, 102, 241, 0.2);
            color: #818cf8;
        }

        .channel-btn {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 12px;
            background: transparent;
            border: 1px solid transparent;
            border-radius: 10px;
            color: #94a3b8;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            margin-bottom: 4px;
            text-align: left;
            transition: all 0.2s;
        }

        .channel-btn:hover {
            background: rgba(51, 65, 85, 0.5);
            color: white;
        }

        .channel-btn.active {
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
            border-color: rgba(99, 102, 241, 0.3);
            color: white;
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.2);
        }

        .channel-hash {
            font-size: 16px;
            opacity: 0.5;
        }

        .dm-btn {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 12px;
            background: transparent;
            border: 1px solid transparent;
            border-radius: 10px;
            color: #94a3b8;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            margin-bottom: 4px;
            text-align: left;
            transition: all 0.2s;
        }

        .dm-btn:hover {
            background: rgba(51, 65, 85, 0.5);
            color: white;
        }

        .dm-btn.active {
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(20, 184, 166, 0.2) 100%);
            border-color: rgba(16, 185, 129, 0.3);
            color: white;
        }

        .dm-avatar {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 2px solid #334155;
        }

        .chat-main {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: linear-gradient(180deg, rgba(15, 23, 42, 0.5) 0%, rgba(30, 41, 59, 0.3) 100%);
        }

        .chat-header {
            padding: 16px 24px;
            background: rgba(30, 41, 59, 0.5);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
        }

        .chat-header-content {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .header-icon {
            width: 44px;
            height: 44px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 700;
            font-size: 18px;
        }

        .header-title {
            font-weight: 700;
            color: white;
            font-size: 16px;
        }

        .header-subtitle {
            font-size: 12px;
            color: #64748b;
        }

        .messages-area {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
        }

        .message-row {
            display: flex;
            gap: 12px;
            margin-bottom: 16px;
            animation: fadeIn 0.3s ease;
        }

        .message-row.mine {
            flex-direction: row-reverse;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .message-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: 2px solid #334155;
            flex-shrink: 0;
        }

        .message-content {
            max-width: 400px;
        }

        .message-author {
            font-size: 11px;
            font-weight: 600;
            color: #818cf8;
            margin-bottom: 4px;
            margin-left: 4px;
        }

        .message-bubble {
            padding: 12px 16px;
            border-radius: 16px;
            font-size: 14px;
            line-height: 1.5;
            color: white;
        }

        .message-bubble.other {
            background: rgba(51, 65, 85, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-top-left-radius: 4px;
        }

        .message-bubble.mine {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            border-top-right-radius: 4px;
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }

        .message-time {
            font-size: 10px;
            color: #64748b;
            margin-top: 6px;
            margin-left: 4px;
        }

        .message-row.mine .message-time {
            text-align: right;
            margin-right: 4px;
        }

        .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #64748b;
            text-align: center;
        }

        .empty-icon {
            width: 80px;
            height: 80px;
            background: rgba(51, 65, 85, 0.3);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
        }

        .empty-icon svg {
            width: 40px;
            height: 40px;
            opacity: 0.5;
        }

        .input-area {
            padding: 16px 24px;
            background: rgba(30, 41, 59, 0.3);
            border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .input-form {
            display: flex;
            gap: 12px;
        }

        .message-input {
            flex: 1;
            padding: 14px 20px;
            background: rgba(51, 65, 85, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            color: white;
            font-size: 14px;
            outline: none;
            transition: all 0.2s;
        }

        .message-input:focus {
            border-color: rgba(99, 102, 241, 0.5);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .message-input::placeholder {
            color: #64748b;
        }

        .send-btn {
            padding: 14px 24px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            border: none;
            border-radius: 16px;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
            transition: all 0.2s;
        }

        .send-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
        }

        .send-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        .send-btn svg {
            width: 20px;
            height: 20px;
        }

        .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100;
        }

        .modal-content {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            border-radius: 20px;
            padding: 32px;
            width: 100%;
            max-width: 420px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
        }

        .modal-header {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 24px;
        }

        .modal-icon {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            font-weight: 700;
        }

        .modal-title {
            font-size: 20px;
            font-weight: 700;
            color: white;
        }

        .modal-subtitle {
            font-size: 13px;
            color: #64748b;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-label {
            display: block;
            font-size: 13px;
            font-weight: 500;
            color: #cbd5e1;
            margin-bottom: 8px;
        }

        .form-input {
            width: 100%;
            padding: 12px 16px;
            background: rgba(51, 65, 85, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            color: white;
            font-size: 14px;
            outline: none;
            transition: all 0.2s;
        }

        .form-input:focus {
            border-color: rgba(99, 102, 241, 0.5);
        }

        .form-textarea {
            resize: none;
            min-height: 80px;
        }

        .modal-actions {
            display: flex;
            gap: 12px;
            margin-top: 24px;
        }

        .btn-cancel {
            flex: 1;
            padding: 12px;
            background: rgba(51, 65, 85, 0.5);
            border: none;
            border-radius: 12px;
            color: #cbd5e1;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-cancel:hover {
            background: rgba(51, 65, 85, 0.8);
        }

        .btn-create {
            flex: 1;
            padding: 12px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            border: none;
            border-radius: 12px;
            color: white;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
            transition: all 0.2s;
        }

        .btn-create:hover {
            box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
        }
    </style>

    <div class="team-chat-container" wire:poll.3s="pollMessages">
        {{-- Sidebar --}}
        <div class="chat-sidebar">
            <div class="sidebar-header">
                <div class="sidebar-header-content">
                    <div class="sidebar-logo">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                        </svg>
                    </div>
                    <div>
                        <div class="sidebar-title">Editorial Team</div>
                        <div class="sidebar-status">
                            <span class="status-dot"></span>
                            Online
                        </div>
                    </div>
                </div>
            </div>

            <div class="search-container">
                <input type="text" class="search-input" wire:model.live.debounce.300ms="searchQuery" wire:keyup="search"
                    placeholder="🔍 Search messages...">
            </div>

            <div class="channels-section">
                <div class="section-header">
                    <span class="section-title">Channels</span>
                    <button class="add-channel-btn" wire:click="$set('showNewChannelModal', true)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                    </button>
                </div>

                @foreach($channels as $channel)
                    <button wire:click="selectChannel({{ $channel['id'] }})"
                        class="channel-btn {{ $activeChannel && $activeChannel->id === $channel['id'] ? 'active' : '' }}">
                        <span class="channel-hash">#</span>
                        {{ $channel['name'] }}
                    </button>
                @endforeach

                <div class="section-header" style="margin-top: 20px;">
                    <span class="section-title">Direct Messages</span>
                </div>

                @foreach($dmUsers as $user)
                    <button wire:click="selectDmUser({{ $user['id'] }})"
                        class="dm-btn {{ $activeDmUser && $activeDmUser->id === $user['id'] ? 'active' : '' }}">
                        <img src="{{ $user['avatar'] }}" class="dm-avatar" alt="">
                        {{ $user['name'] }}
                    </button>
                @endforeach
            </div>
        </div>

        {{-- Main Chat --}}
        <div class="chat-main">
            <div class="chat-header">
                <div class="chat-header-content">
                    @if($isDmMode && $activeDmUser)
                        <img src="https://ui-avatars.com/api/?name={{ urlencode($activeDmUser->name) }}&background=6366f1&color=fff"
                            style="width:44px;height:44px;border-radius:50%;border:3px solid #10b981;" alt="">
                        <div>
                            <div class="header-title">{{ $activeDmUser->name }}</div>
                            <div class="header-subtitle">Direct Message</div>
                        </div>
                    @elseif($activeChannel)
                        <div class="header-icon">#</div>
                        <div>
                            <div class="header-title">{{ $activeChannel->name }}</div>
                            <div class="header-subtitle">{{ $activeChannel->description ?? 'Channel conversation' }}</div>
                        </div>
                    @else
                        <div class="header-icon" style="background: #334155;">💬</div>
                        <div>
                            <div class="header-title" style="color: #64748b;">Select a conversation</div>
                            <div class="header-subtitle">Choose a channel or send a direct message</div>
                        </div>
                    @endif
                </div>
            </div>

            <div class="messages-area">
                @php $messagesToShow = $isDmMode ? $dmMessages : $messages; @endphp
                @forelse($messagesToShow as $message)
                    <div class="message-row {{ $message['is_mine'] ? 'mine' : '' }}">
                        @if(!$isDmMode && !$message['is_mine'])
                            <img src="{{ $message['user_avatar'] }}" class="message-avatar" alt="">
                        @endif
                        <div class="message-content">
                            @if(!$isDmMode && !$message['is_mine'])
                                <div class="message-author">{{ $message['user_name'] }}</div>
                            @endif
                            <div class="message-bubble {{ $message['is_mine'] ? 'mine' : 'other' }}">
                                {{ $message['content'] }}
                            </div>
                            <div class="message-time">{{ $message['created_at'] }}</div>
                        </div>
                    </div>
                @empty
                    <div class="empty-state">
                        <div class="empty-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                            </svg>
                        </div>
                        <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">No messages yet</div>
                        <div style="font-size: 14px;">Start the conversation!</div>
                    </div>
                @endforelse
            </div>

            <div class="input-area">
                <form wire:submit.prevent="sendMessage" class="input-form">
                    <input type="text" class="message-input" wire:model="newMessage"
                        placeholder="{{ $activeChannel ? 'Message #' . $activeChannel->name . '...' : ($activeDmUser ? 'Message ' . $activeDmUser->name . '...' : 'Select a conversation...') }}"
                        @if(!$activeChannel && !$activeDmUser) disabled @endif>
                    <button type="submit" class="send-btn" @if(!$activeChannel && !$activeDmUser) disabled @endif>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    </div>

    @if($showNewChannelModal)
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-icon">#</div>
                    <div>
                        <div class="modal-title">Create Channel</div>
                        <div class="modal-subtitle">Channels are for team conversations</div>
                    </div>
                </div>

                <form wire:submit.prevent="createChannel">
                    <div class="form-group">
                        <label class="form-label">Channel Name</label>
                        <input type="text" class="form-input" wire:model="newChannelName" placeholder="e.g., announcements">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Description (optional)</label>
                        <textarea class="form-input form-textarea" wire:model="newChannelDescription"
                            placeholder="What's this channel about?"></textarea>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-cancel"
                            wire:click="$set('showNewChannelModal', false)">Cancel</button>
                        <button type="submit" class="btn-create">Create Channel</button>
                    </div>
                </form>
            </div>
        </div>
    @endif
</x-filament-panels::page>