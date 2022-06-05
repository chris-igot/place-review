import { validate } from "class-validator";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import User from "../entities/User";

export async function registration(req: Request, res: Response) {
    const regForm = AppDataSource.getRepository(User).create(
        req.body as Object
    );
    const validationErrors = await validate(regForm);
    let status = 200;
    let newUser: typeof regForm;

    if (validationErrors.length > 0) {
        console.error(validationErrors);
        status = 400;
    } else {
        let error: Error;

        regForm.setPassword(regForm.password);
        regForm.email = regForm.email.toLowerCase();
        try {
            newUser = await AppDataSource.manager.save(regForm);
        } catch (e) {
            error = e as Error;
        }

        console.log({ newEntity: newUser });

        if (error) {
            if (error.message.startsWith("ER_DUP_ENTRY")) {
                status = 409;
            } else {
                status = 400;
            }
            console.error(error.name, error.message);
        } else if (newUser) {
            req.session.user = { id: newUser.id };
            // const roleFromDB = await AppDataSource.manager.findOneBy(Role, {
            //     name: "base",
            //     category: type,
            // });

            // console.log({ roleFromDB });

            // if (newUser.roles) {
            //     newUser.roles.push(roleFromDB);
            // } else {
            //     newUser.roles = [];
            //     newUser.roles.push(roleFromDB);
            // }
            console.log({ newEntity: newUser });
            // await AppDataSource.manager.save(newUser);

            status = 200;
        } else {
            status = 500;
        }
    }

    res.sendStatus(status);
}

export async function login(req: Request, res: Response) {
    const loginForm = AppDataSource.getRepository(User).create(
        req.body as Object
    );
    let status = 200;
    let entityFromDB: typeof loginForm;

    if (
        typeof loginForm.email === "string" &&
        typeof loginForm.password === "string"
    ) {
        let error: Error;

        try {
            entityFromDB = await AppDataSource.manager.findOneByOrFail(User, {
                email: loginForm.email,
            });
        } catch (e) {
            error = e as Error;
        }

        if (error) {
            if (error.name === "EntityNotFoundError") {
                status = 418;
            } else {
                status = 400;
            }
            console.error(error.name, error.message);
        } else if (entityFromDB) {
            try {
                if (entityFromDB.checkPassword(loginForm.password)) {
                    if (req.session) {
                        if (req.session.venues) {
                            delete req.session.venues;
                        }
                        if (req.session.patrons) {
                            delete req.session.patrons;
                        }
                    }
                    req.session.user = {
                        ...req.session.user,
                        id: entityFromDB.id,
                    };
                    status = 200;
                } else {
                    status = 418;
                }
            } catch (e) {
                console.log(e);
                status = 407;
            }
        } else {
            status = 406;
        }
    } else {
        status = 400;
    }

    res.sendStatus(status);
}

export function logout(req: Request, res: Response) {
    req.session = null;
    res.sendStatus(200);
}

export async function retrieve(req: Request, res: Response) {
    const id = req.session.user.id as string;
    const entityFromDB = await AppDataSource.getRepository(User)
        .createQueryBuilder("users")
        // .leftJoinAndSelect(`${"users"}.roles`, "roles")
        .where({ id })
        .getOne();

    if (entityFromDB) {
        res.send(entityFromDB);
    } else {
        res.sendStatus(404);
    }
}
