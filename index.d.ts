import {
  ButtonInteraction,
  EmbedData,
  GuildMember,
  Interaction,
  InteractionReplyOptions,
  Message,
} from "discord.js/typings";
import { Bot } from "./handlers/Client.js";

export interface Mcommand {
  name: string | null;
  description: string | null;
  userPermissions: bigint;
  botPermissions: bigint;
  category: string | null;
  type: number;
  owneronly: boolean;
  run: (
    client: Bot,
    message: Message,
    args: string[] | null,
    prefix: string | null
  ) => {};
}

export type send = (
  interaction: Interaction,
  data: InteractionReplyOptions
) => Message;

export type sendEmbed = (
  interaction: Interaction,
  data: EmbedData | string,
  ephemeral: boolean
) => Message;

export interface TicketData {
  channel: string | null;
  ticketId: string | null;
  embed: {
    ticketSetup: {
      title: string | null;
      description: string | null;
      color: string | null;
      footer: {
        text: string | null;
        iconURL: string | null;
      };
      image: string | null;
      thumbnail: string | null;
      author: {
        name: string | null;
        iconURL: string | null;
      };
    };
    ticketWelcome: {
      title: string | null;
      description: string | null;
      color: string | null;
      footer: {
        text: string | null;
        iconURL: string | null;
      };
      image: string | null;
      thumbnail: string | null;
      author: {
        name: string | null;
        iconURL: string | null;
      };
    };
  };
  categoryId: string | null;
  logging: {
    enable: boolean;
    channelId: string | null;
  };
  tickets: Ticket[];
  assignedTickets: [];
  mods: [];
}

export interface Ticket {
  userId: string | null;
  channelId: string | null;
  ticketName: string | null;
  isDeleted: boolean;
}

export type LoggerType =
  | "create_ticket"
  | "delete_ticket"
  | "person_add"
  | "person_remove"
  | "ticket_transcript";

export interface TicketLoggerInterface {
  client: Bot;
  type: LoggerType;
  data: TicketData;
  interaction: ButtonInteraction;
  ticket: Ticket;
  addedUser: GuildMember;
}

export type TicketLogger = (LoggerOptions: TicketLoggerInterface) => void;

export type replaceValues = (
  message: string,
  replacements: Record<string, string>
) => string;

export interface builderData {
  message: string;
  embed: EmbedData;
}

interface NumberEmojiMap {
  [key: number]: string;
}
