export interface FinancialAIProvider{answerFinancialQuestion(question:string):Promise<string>;explainFinancialInsight(insight:unknown):Promise<string>;}
export interface ReceiptExtraction{merchant:string;date:string;total:string;items:{description:string;amount:string}[];}
export interface OCRProvider{extractReceipt(file:Blob):Promise<ReceiptExtraction>;}
export interface Transcript{text:string;language:string;}
export interface ASRProvider{transcribe(audio:Blob):Promise<Transcript>;}
export interface ParsedTransaction{type:string;amount:string;category:string;date:string;account:string;paymentMethod:string;splitParticipants:string[];}
export interface FinancialTextParser{parseFinancialText(text:string):Promise<ParsedTransaction[]>;}
export class DisabledAIProvider implements FinancialAIProvider{async answerFinancialQuestion(){return 'AI functionality is not connected yet.';}async explainFinancialInsight(){return 'AI functionality is not connected yet.';}}
export class DisabledOCRProvider implements OCRProvider{async extractReceipt():Promise<ReceiptExtraction>{throw new Error('OCR is not connected yet. Use manual entry.');}}
export class DisabledASRProvider implements ASRProvider{async transcribe():Promise<Transcript>{throw new Error('Coming in AI integration phase.');}}
export class DisabledFinancialTextParser implements FinancialTextParser{async parseFinancialText():Promise<ParsedTransaction[]>{throw new Error('Financial text parsing is not connected yet.');}}
