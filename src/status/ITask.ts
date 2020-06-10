export default interface ITask {
  id: string;
  name: string;
  details: string;
  complete: boolean;
  period?: Date;
}
