import { Request, Response, Router } from "express";
import { Page } from "../../contracts/Page";
import { Task } from "../../entity/Task";
import { UserMiddleware } from "../../middleware/userMiddleware";

export class Edit extends Page {
    constructor(router: Router) {
        super(router);
    }

    public OnPost() {
        super.router.post('/edit', UserMiddleware.Authorise, async (req: Request, res: Response) => {
            const taskString = req.body.taskString;
            const name = req.body.name;
            const description = req.body.description;

            if (!taskString) {
                req.session.error = "Task not found";
                res.redirect(`/tasks/list`);
                return;
            }

            if (!name) {
                req.session.error = "Name is required";
                res.redirect(`/tasks/view/${taskString}`);
                return;
            }

            const result = await Task.EditTask(taskString, name, description, req.session.User);

            if (!result) {
                req.session.error = 'Unable to edit task';
            }

            res.redirect(`/tasks/view/${taskString}`);
        });
    }
}