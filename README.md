# Scheduler

This is a web application I built to assist in scheduling students to work.
The student's schedule has to be worked around so that they may go to class, study, and perform other obligations.
In order to help a helpdesk staffed a lot of manual schedule building was required.
Students were originally having to send in their availablity schedule, but this process was manual, tedious, and rigid.
The schedules were not always consistent from week to week and a lot of time would be spent making this work.
I didn't consider this to be good for students as they are busy enough without having to try to manage scheduling.

Instead of having students supply a schedule as a document or input it to the site, this service queries their Outlook calendars using Microsoft's Graph API. An availability list is generated from this which is used to provide suggestions on when people should be scheduled. This application does not generate a final schedule by itself, but it useful to help find solutions which can be verified and finished by a human.

I am no longer a student and this project is long since unmaintained.
I built it to solve a problem that was bothering me at my workplace.

# Build

Use yarn to install dependencies and build the app

1. `yarn install`
2. `yarn build`
3. `yarn start`

