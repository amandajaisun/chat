import classnames from "classnames";
import formatRelative from "date-fns/formatRelative";
import React from "react";
import {useChannelStore} from "../stores/channels";
import {useMessageStore} from "../stores/messages";
import {useUserStore} from "../stores/users";
import MessageEditor from "./MessageEditor";
import styles from "./MessageViewer.module.css";
import {reaction} from "../actions";

const Message = ({content, createdAt, id, userId, channelId, thumb, heart, face}) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const user = useUserStore((state) =>
        state.users.find((user) => user.id === userId)
    );
    const activeUserId = useUserStore((state) => state.activeUserId);
    const dateInstance = React.useMemo(() => new Date(createdAt), [createdAt]);

    const thumbButtonName = "thumb-button".concat(id);
    const thumbButtonCount = "thumb-click-count".concat(id);
    const [thumbCounter, setThumbCounter] = React.useState(thumb.length);
    const [thumbOn, setThumb] = React.useState(thumb.includes(activeUserId));

    const heartButtonName = "heart-button".concat(id);
    const heartButtonCount = "heart-click-count".concat(id);
    const [heartCounter, setHeartCounter] = React.useState(heart.length);
    const [heartOn, setHeart] = React.useState(heart.includes(activeUserId));

    const faceButtonName = "face-button".concat(id);
    const faceButtonCount = "face-click-count".concat(id);
    const [faceCounter, setFaceCounter] = React.useState(face.length);
    const [faceOn, setFace] = React.useState(face.includes(activeUserId));

    async function buttonClicked(thisEmojiType) {
        await reaction({
            messageId: id,
            channelId: channelId,
            emojiType: thisEmojiType,
        });
        switch (thisEmojiType) {
            case "thumb":
                if (thumbOn) {
                    document.getElementById(thumbButtonName).setAttribute("clicked", "true");
                    document.getElementById(thumbButtonCount).innerText = (thumbCounter - 1).toString();
                    setThumbCounter(thumbCounter - 1);
                    setThumb(false);
                } else {
                    document.getElementById(thumbButtonName).setAttribute("clicked", "false");
                    document.getElementById(thumbButtonCount).innerText = (thumbCounter + 1).toString();
                    setThumbCounter(thumbCounter + 1);
                    setThumb(true);
                }
                break;

            case "heart":
                if (heartOn) {
                    document.getElementById(heartButtonName).setAttribute("clicked", "true");
                    document.getElementById(heartButtonCount).innerText = (heartCounter - 1).toString();
                    setHeartCounter(heartCounter - 1);
                    setHeart(false);

                } else {
                    document.getElementById(heartButtonName).setAttribute("clicked", "false");
                    document.getElementById(heartButtonCount).innerText = (heartCounter + 1).toString();
                    setHeartCounter(heartCounter + 1);
                    setHeart(true);
                }
                break;

            case "face":
                if (faceOn) {
                    document.getElementById(faceButtonName).setAttribute("clicked", "true");
                    document.getElementById(faceButtonCount).innerText = (faceCounter - 1).toString();
                    setFaceCounter(faceCounter - 1);
                    setFace(false);

                } else {
                    document.getElementById(faceButtonName).setAttribute("clicked", "false");
                    document.getElementById(faceButtonCount).innerText = (faceCounter + 1).toString();
                    setFaceCounter(faceCounter + 1);
                    setFace(true);
                }
                break;

            default:
                console.log("Yikes! Switch statements not working.")
        }
    }

    return (
        <div className={styles.message}>
            <div className={styles.metadata}>
                {user == null ? null : (
                    <span className={styles.username}>{user.username}</span>
                )}
                <span className={styles.timestamp}>
          {formatRelative(dateInstance, new Date())}
        </span>
            </div>
            {isEditing ? (
                <MessageEditor
                    channelId={channelId}
                    id={id}
                    content={content}
                    onClose={() => setIsEditing(false)}
                />
            ) : (
                content
            )}
            {userId === activeUserId && !isEditing ? (
                <button
                    onClick={() => setIsEditing(true)}
                    className={styles.editButton}
                >
                    Edit
                </button>
            ) : null}
            {/*Emoji Buttons*/}
            <div className="break"></div>
            {
                <button
                    className={styles.reactionButton}

                    onClick={async (event) => {
                        buttonClicked("thumb")
                    }}

                    id={thumbButtonName}
                    clicked={thumbOn.toString()}

                >
                    <span role="img" aria-label="Thumb">👍</span> <span id={thumbButtonCount}>{thumbCounter}</span>
                </button>
            }

            {
                <button
                    className={styles.reactionButton}

                    onClick={async (event) => {
                        buttonClicked("heart")
                    }}

                    id={heartButtonName}
                    clicked={heartOn.toString()}

                >
                    <span role="img" aria-label="Heart">❤️</span> <span id={heartButtonCount}>{heartCounter}</span>
                </button>
            }
            {
                <button
                    className={styles.reactionButton}

                    onClick={async (event) => {
                        buttonClicked("face")
                    }}

                    id={faceButtonName}
                    clicked={faceOn.toString()}

                >
                    <span role="img" aria-label="Face">😂</span> <span id={faceButtonCount}>{faceCounter}</span>
                </button>
            }
        </div>
    );
};

const MessageViewer = () => {
    const allMessages = useMessageStore((state) => state.messages);
    const activeChannelId = useChannelStore((state) => state.activeChannelId);
    const messagesForActiveChannel = React.useMemo(
        () =>
            allMessages.filter((message) => message.channelId === activeChannelId),
        [activeChannelId, allMessages]
    );
    const isEmpty = messagesForActiveChannel.length === 0;

    return (
        <div
            className={classnames(styles.wrapper, {[styles.wrapperEmpty]: isEmpty})}
        >
            {isEmpty ? (
                <div className={styles.empty}>
                    No messages{" "}
                    <span aria-label="Sad face" role="img">
            😢
          </span>
                </div>
            ) : (
                messagesForActiveChannel.map((message) => (
                    <Message
                        channelId={activeChannelId}
                        key={message.id}
                        id={message.id}
                        content={message.content}
                        createdAt={message.createdAt}
                        userId={message.userId}
                        thumb={message.thumb}
                        heart={message.heart}
                        face={message.face}
                    />
                ))
            )}
        </div>
    );
};

export default MessageViewer;
