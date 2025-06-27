export interface PowerSyncMessage {
  id: string;
  metadata: string;
  thread_id: string;
}


export interface LangChainMessage {
  id: string[];
  lc: number;
  type: string;
  kwargs: {
    id: string;
    content: string;
    additional_kwargs?: any;
    response_metadata?: any;
    tool_calls?: any[];
    usage_metadata?: any;
    tool_call_chunks?: any[];
    invalid_tool_calls?: any[];
  };
}