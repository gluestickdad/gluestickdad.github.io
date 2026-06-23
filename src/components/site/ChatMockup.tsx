import { motion } from "framer-motion";
import { DiscordPanel, DiscordMessage, BotMessage, renderContent } from "./discord";

const chatter = [
  { name: "Alex", color: "#3aa0ff", time: "7:42 PM", text: "anyone up for a game tonight?" },
  { name: "Mira", color: "#d061ff", time: "7:43 PM", text: "yesss, drop a link when ready" },
  { name: "Jordan", color: "#e08a2b", time: "7:44 PM", text: "wait, what channel are we using?" },
  {
    name: "Sam",
    color: "#1fb877",
    time: "7:45 PM",
    text: "scroll down — the info is always glued 👇",
  },
];

const gluedText =
  "Welcome to the server! Read #rules before posting, grab roles in #self-roles, and watch #announcements for events.";

export function ChatMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="glass relative w-full max-w-md rounded-2xl p-1"
    >
      <DiscordPanel channel="general">
        <div className="space-y-3.5">
          {chatter.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.12 }}
            >
              <DiscordMessage name={m.name} color={m.color} time={m.time}>
                {m.text}
              </DiscordMessage>
            </motion.div>
          ))}

          {/* Glued bot message */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <BotMessage time="Today at 7:45 PM" muted>
              <p>{renderContent(gluedText)}</p>
            </BotMessage>
          </motion.div>
        </div>
      </DiscordPanel>
    </motion.div>
  );
}
