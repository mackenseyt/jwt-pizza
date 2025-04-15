# Andy Mam and Kensey Thomason Penetration Tests

### Andy Self-Attack

| Item           | Result                                                                         |
| -------------- | ------------------------------------------------------------------------------ |
| Date           | April 11, 2025                                                                 |
| Target         | pizza.mampizza.click                                                       |
| Classification | Identification and Authentication Failures                                                                     |
| Severity       | 2                                                                              |
| Description    | Admin password was weak. Anyone could have guessed it and gained admin privileges.                |
| Images         | ![Dead database](andy-test.png) <br/> Sensitive information exposed. |
| Corrections    | Change admin password.                                                          |


### Mackensey Self-Attack

| Item              | Result                                                                 |
|-------------------|------------------------------------------------------------------------|
| **Date**          | April 11, 2025                                                        |
| **Target**        | https://pizza.byucs329studentpizzawebpage.click/                      |
| **Classification**| Privilege Escalation                                                 |
| **Severity**      | 3                                                                |
| **Description**   | Attempted to upgraded regular user to admin and create franchise.     |
| **Images**        | ![Penetration Test Image](./PenPic.png)                         A fake user created the "Ur Mom" franchise, which is non-functional and not serviceable to customers. |
| **Corrections**   | Sanitized inputs and enforced role-based access control.       |


# Peer Tests

### Andy Attack Kensey

| Item           | Result                                                                         |
| -------------- | ------------------------------------------------------------------------------ |
| Date           | April 14, 2025                                                                 |
| Target         | https://pizza.byucs329studentpizzawebpage.click/                                                       |
| Classification | Identification and Authentication Failures                                                                     |
| Severity       | 2                                                                              |
| Description    | Guessed her admin password lol.                |
| Images         | ![Dead database](andy-attack-kensey.png) <br/> I can delete stores. |
| Corrections    | Change admin password.                                                          |


## Mackensey Thomason attacking Andy Mam

| Item              | Result                                                                 |
|-------------------|------------------------------------------------------------------------|
| **Date**          | April 11, 2025                                                        |
| **Target**        | https://pizza.mampizza.click/                      |
| **Classification**| Broken Authentication / JWT Tampering Attempt                                                |
| **Severity**      | 0 (no breach occurred)                                                              |
| **Description**   | A forged JWT was generated to impersonate an admin by modifying the payload. While the token had a valid signature, the server correctly denied access because it checked user ID and roles in the backend database.|
| **Images**        | ![Penetration Test Image](./attempt.png) used JWT.io to try and impersonate and admin.|
| **Corrections**   |No correction needed — backend properly validates identity server-side.|