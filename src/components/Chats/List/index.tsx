import { Container, Paper, ScrollArea, Text } from "@mantine/core";
import { createRef, useContext, useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Chat } from "@/interfaces";
import { states } from "@/store/index";
import { AppwriteContext } from "@/components/Appwrite";
import useStyles from "./List.style";
import { Models } from "appwrite";
import { useScrollIntoView } from "@mantine/hooks";

const MessageList: React.FC = () => {
	const [messages, setMessages] = useRecoilState(states.chatsState);
	const appwrite = useContext(AppwriteContext);
	const user = useRecoilValue(states.userState);

	const { classes, cx } = useStyles();

	const viewport = useRef<HTMLDivElement>(null);
	const scrollToBottom = () =>
		viewport!.current!.scrollTo({
			top: viewport!.current!.scrollHeight,
			behavior: "smooth",
		});

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	useEffect(() => {
		// subscription to new messages
		const unsubscribe = appwrite?.appwrite?.subscribe(
			`collections.${appwrite.collectionId}.documents`,
			(response) => {
				// @ts-ignore
				if (response.event === "database.documents.create") {
					setMessages(
						(messages) =>
							new Set([
								...Array.from(messages),
								{
									...(response.payload as Chat),
									id: (response.payload as Models.Document)
										.$id,
								} as Chat,
							])
					);
				}
			}
		);

		return () => {
			unsubscribe!();
		};
	}, []);

	useEffect(() => {
		// load all messages on render
		(async () => {
			setMessages(await appwrite?.getChats()!);
		})();
	}, []);

	return (
		<Container className={classes.root}>
			<ScrollArea className={classes.container} viewportRef={viewport}>
				{Array.from(messages).map((message) => (
					<Paper
						key={message.id}
						withBorder
						className={cx(classes.message, {
							[classes.messageMe]: user?.name === message.name,
						})}
					>
						<Text size="md">{message.message}</Text>
						<Text size="xs" className={classes.messageName}>
							{message.name}
						</Text>
					</Paper>
				))}
			</ScrollArea>
		</Container>
	);
};

export default MessageList;
