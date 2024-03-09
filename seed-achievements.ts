import { prisma } from './common/prisma';
import { achievement_template_for_enum, achievement_type_enum } from '@prisma/client';

export async function importAchievements() {
    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Global,
            group: 'student_onboarding',
            groupOrder: 1,
            sequentialStepName: 'Verifizieren',
            type: achievement_type_enum.SEQUENTIAL,
            title: 'Onboarding',
            tagline: 'Willkommen bei Lern-Fair 👋',
            description:
                'Hurra! Am {{date}} haben wir eine E-Mail an deine Adresse {{email}} gesendet. Um deine E-Mail zu bestätigen; klicke einfach auf den Button in der Nachricht. Solltest du unsere E-Mail nicht finden; kannst du hier eine erneute Zustellung anfordern und voller Vorfreude auf unser Weiterkommen warten.',
            achievedDescription: null,
            image: 'gamification/achievements/tmp/finish_onboarding/three_pieces/empty_state.png',
            achievedImage: null,
            actionName: 'E-Mail verifizieren',
            actionRedirectLink: 'Verifizierungsmail senden?',
            actionType: null,
            achievedFooter: null,
            condition: 'student_verified_events > 0',
            conditionDataAggregations: JSON.parse('{"student_verified_events":{"metric":"student_onboarding_verified","aggregator":"count"}}'),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Global,
            group: 'student_onboarding',
            groupOrder: 2,
            sequentialStepName: 'Screening absolvieren',
            type: achievement_type_enum.SEQUENTIAL,
            title: 'Onboarding',
            tagline: 'Willkommen bei Lern-Fair 👋',
            description:
                'Wir sind gespannt darauf; dich kennenzulernen! In einem kurzen; 15-minütigen Zoom-Gespräch möchten wir dir gerne unsere vielfältigen Engagement-Möglichkeiten vorstellen und alle deine Fragen beantworten. Buche einfach einen Termin; um mehr zu erfahren und dann voller Tatendrang direkt durchzustarten. Falls dir etwas dazwischen kommt; sage den Termin bitte ab und buche dir einen neuen.',
            achievedDescription: null,
            image: 'gamification/achievements/tmp/finish_onboarding/three_pieces/step_1.png',
            achievedImage: null,
            actionName: 'Kennenlerngespräch absolvieren',
            actionRedirectLink: 'Calendly HuH',
            actionType: null,
            achievedFooter: null,
            condition: 'student_screened_events > 0',
            conditionDataAggregations: JSON.parse('{"student_screened_events":{"metric":"student_onboarding_screened","aggregator":"count"}}'),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Global,
            group: 'student_onboarding',
            groupOrder: 3,
            sequentialStepName: 'Führungszeugnis einreichen',
            type: achievement_type_enum.SEQUENTIAL,
            title: 'Onboarding',
            tagline: 'Willkommen bei Lern-Fair 👋',
            description:
                'Der Schutz von Kindern und Jugendlichen liegt uns sehr am Herzen; daher benötigen wir von allen Ehrenamtlichen ein erweitertes Führungszeugnis. Im nächsten Schritt findest du eine Anleitung zur Beantragung sowie eine Bescheinigung zur Kostenübernahme für das erweiterte Führungszeugnis. Um deinen Account aktiv zu halten; bitten wir dich; das erweiterte Führungszeugnis bis zum {{date}} bei uns einzureichen. Gemeinsam setzen wir uns für eine sichere Umgebung ein; in der alle sich wohl und geschützt fühlen können.',
            achievedDescription:
                'Herzlichen Glückwunsch! Du hast alle Onboarding-Schritte erfolgreich gemeistert und dir das Abflugticket für Loki gesichert. Wir sind begeistert; dass du nun Teil unseres Teams bist und Schüler:innen auf ihrem Lernweg begleitest. Gemeinsam setzen wir uns für eine bessere Bildung in Deutschland ein. Du bist bereits jetzt ein:e Lern-Fair Held:in! ❤️ Danke für dein Engagement und deine Begeisterung!',
            image: 'gamification/achievements/tmp/finish_onboarding/three_pieces/step_2.png',
            achievedImage: 'gamification/achievements/tmp/finish_onboarding/three_pieces/step_3.png',
            actionName: 'Führungszeugnis einreichen',
            actionRedirectLink: 'FZ-Seite',
            actionType: null,
            achievedFooter: 'Wow! Du hast alle Schritte abgeschlossen.',
            condition: 'student_coc_success_events > 0',
            conditionDataAggregations: JSON.parse('{"student_coc_success_events":{"metric":"student_onboarding_coc_success","aggregator":"count"}}'),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Global_Matches,
            group: 'student_conduct_match_appointment',
            groupOrder: 1,
            sequentialStepName: null,
            type: achievement_type_enum.TIERED,
            title: '1 durchgeführter Termin',
            tagline: '1:1-Nachhilfe',
            description:
                'Sobald du einen Nachhilfe-Termin erfolgreich durchgeführt hast; geht die Reise mit unserer Eule Loki weiter. Bleib dran und schließe alle Termine ab; um zu sehen wohin euch die Lernreise als Nächstes führt.',
            achievedDescription:
                'Super! Du hattest deinen ersten Nachhilfe-Termin mit deinem:r Lernpartner:in. Bleibt am Ball und setzt eure Lernreise motiviert fort. Genau wie unsere Eule Loki noch eine lange Reise vor sich hat; gibt es auch für deine:n Lernpartner:in noch vieles zu lernen. Wir hoffen; dass ihr beim gemeinsamen Lernen genauso viel Spaß haben werdet wie Loki beim Paddeln.',
            image: 'gamification/achievements/tmp/x_lectures_held/one_lectures_held.jpg',
            achievedImage: null,
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedFooter: 'Wow! Du hast alle Termine abgeschlossen.',
            condition: 'student_match_appointments_count > 0',
            conditionDataAggregations: JSON.parse(
                '{"student_match_appointments_count":{"metric":"student_conducted_match_appointment","aggregator":"count","createBuckets":"by_lecture_participation","bucketAggregator":"presence_of_events","valueToAchieve":1}}'
            ),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Global_Matches,
            group: 'student_conduct_match_appointment',
            groupOrder: 2,
            sequentialStepName: null,
            type: achievement_type_enum.TIERED,
            title: '3 durchgeführte Termine',
            tagline: '1:1-Nachhilfe',
            description:
                'Sobald du drei Nachhilfe-Termine erfolgreich durchgeführt hast; geht die Reise mit unserer Eule Loki weiter. Bleib dran und schließe alle Termine ab; um zu sehen wohin euch die Lernreise als Nächstes führt.',
            achievedDescription:
                'Prima! Du hattest nun schon drei Nachhilfe-Termine. Schön; dass ihr eure Lernreise so fleißig startet. Lokis Reise führt heute vorbei an einem schönen; blühenden Kirschbaum. Auch der Baum hat einmal klein angefangen.Genauso wie der Baum gewachsen ist; wächst auch das Wissen deines:r Lernpartner:in mit jedem Termin in der Lernunterstützung. Also macht weiter so!',
            image: 'gamification/achievements/tmp/x_lectures_held/three_lectures_held.jpg',
            achievedImage: null,
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedFooter: 'Wow! Du hast alle Termine abgeschlossen.',
            condition: 'student_match_appointments_count > 2',
            conditionDataAggregations: JSON.parse(
                '{"student_match_appointments_count":{"metric":"student_conducted_match_appointment","aggregator":"count","createBuckets":"by_lecture_participation","bucketAggregator":"presence_of_events","valueToAchieve":3}}'
            ),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Global_Matches,
            group: 'student_conduct_match_appointment',
            groupOrder: 3,
            sequentialStepName: null,
            type: achievement_type_enum.TIERED,
            title: '5 durchgeführte Termine',
            tagline: '1:1-Nachhilfe',
            description:
                'Sobald du fünf Nachhilfe-Termine erfolgreich durchgeführt hast; geht die Reise mit unserer Eule Loki weiter. Bleib dran und schließe alle Termine ab; um zu sehen wohin euch die Lernreise als Nächstes führt.',
            achievedDescription:
                'Klasse! Fünf Nachhilfe-Termine in der Lernunterstützung habt ihr schon gemeinsam geschafft. Damit seid ihr auf eurer Lernreise schon weit gekommen. Loki schützt sich auf der Reise vor der Kälte in einem Iglu; das aus Eis gebaut wurde. Baut auch ihr weiter an dem Wissensschatz deiner:s Lernpartner:in; indem ihr weitere Termine in der Lernunterstützung absolviert. Tolle Arbeit; macht weiter!',
            image: 'gamification/achievements/tmp/x_lectures_held/five_lectures_held.jpg',
            achievedImage: null,
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedFooter: 'Wow! Du hast alle Termine abgeschlossen.',
            condition: 'student_match_appointments_count > 4',
            conditionDataAggregations: JSON.parse(
                '{"student_match_appointments_count":{"metric":"student_conducted_match_appointment","aggregator":"count","createBuckets":"by_lecture_participation","bucketAggregator":"presence_of_events","valueToAchieve":5}}'
            ),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Global_Matches,
            group: 'student_conduct_match_appointment',
            groupOrder: 4,
            sequentialStepName: null,
            type: achievement_type_enum.TIERED,
            title: '10 durchgeführte Termine',
            tagline: '1:1-Nachhilfe',
            description:
                'Sobald du zehn Nachhilfe-Termine erfolgreich durchgeführt hast; geht die Reise mit unserer Eule Loki weiter. Bleib dran und schließe alle Termine ab; um zu sehen wohin euch die Lernreise als Nächstes führt.',
            achievedDescription:
                'Beeindruckend! Nun habt ihr schon zehn Nachhilfe-Termine in der Lernunterstützung wahrgenommen und ihr setzt eure gemeinsame Lernreise immer weiter fort. Loki befindet sich aktuell in der Wüste und ist beeindruckt von den unendlichen Weiten. Ähnlich wie in einer Wüste gibt es beim Lernen immer neue Möglichkeiten; weiter zu gehen. Und mit jedem Termin in der Lernunterstützung können du und dein:e Lernpartner:in Neues entdecken. Bleibt dran!',
            image: 'gamification/achievements/tmp/x_lectures_held/ten_lectures_held.jpg',
            achievedImage: null,
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedFooter: 'Wow! Du hast alle Termine abgeschlossen.',
            condition: 'student_match_appointments_count > 9',
            conditionDataAggregations: JSON.parse(
                '{"student_match_appointments_count":{"metric":"student_conducted_match_appointment","aggregator":"count","createBuckets":"by_lecture_participation","bucketAggregator":"presence_of_events","valueToAchieve":10}}'
            ),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Global_Matches,
            group: 'student_conduct_match_appointment',
            groupOrder: 5,
            sequentialStepName: null,
            type: achievement_type_enum.TIERED,
            title: '15 durchgeführte Termine',
            tagline: '1:1-Nachhilfe',
            description:
                'Sobald du 15 Nachhilfe-Termine erfolgreich durchgeführt hast; geht die Reise mit unserer Eule Loki weiter. Bleib dran und schließe alle Termine ab; um zu sehen wohin euch die Lernreise als Nächstes führt.',
            achievedDescription:
                'Absolut großartig! 15-mal habt ihr nun schon in der Lernunterstützung gemeinsam gelernt. Genau wie die Heißluftballons; die Loki auf der Reise entdeckt hat; steigt auch das Wissen deiner:s Lernpartner:in durch Lernen. Jedes Mal; wenn ihr gemeinsam lernt; füllt sich der Ballon des Wissens mit heißer Luft und hebt ab in neue Höhen. Je mehr Wissen angesammelt wird; desto höher steigt der Ballon und desto mehr könnt ihr in der Ferne entdecken. Bleibt dabei und fliegt weiter mit Loki!',
            image: 'gamification/achievements/tmp/x_lectures_held/fifteen_lectures_held.jpg',
            achievedImage: null,
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedFooter: 'Wow! Du hast alle Termine abgeschlossen.',
            condition: 'student_match_appointments_count > 14',
            conditionDataAggregations: JSON.parse(
                '{"student_match_appointments_count":{"metric":"student_conducted_match_appointment","aggregator":"count","createBuckets":"by_lecture_participation","bucketAggregator":"presence_of_events","valueToAchieve":15}}'
            ),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Global_Matches,
            group: 'student_conduct_match_appointment',
            groupOrder: 6,
            sequentialStepName: null,
            type: achievement_type_enum.TIERED,
            title: '25 durchgeführte Termine',
            tagline: '1:1-Nachhilfe',
            description:
                'Sobald du 25 Nachhilfe-Termine erfolgreich durchgeführt hast; geht die Reise mit unserer Eule Loki weiter. Bleib dran und schließe alle Termine ab; um zu sehen wohin euch die Lernreise als Nächstes führt.',
            achievedDescription:
                'Wow! Unglaubliche 25 Termine in der Lernunterstützung liegen jetzt schon hinter euch. Das ist wirklich beeindruckend und ein guter Zeitpunkt; um auf eure bisherige Lernreise zurückzublicken. Du kannst dir gemeinsam mit Loki die Nordlichter auf dem Bild anschauen und daran denken; was du schon alles gemeinsam mit deiner:m Lernpartner:in erreicht hast. Gut gemacht; macht weiter so!',
            image: 'gamification/achievements/tmp/x_lectures_held/twentyfive_lectures_held.jpg',
            achievedImage: null,
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedFooter: 'Wow! Du hast alle Termine abgeschlossen.',
            condition: 'student_match_appointments_count > 24',
            conditionDataAggregations: JSON.parse(
                '{"student_match_appointments_count":{"metric":"student_conducted_match_appointment","aggregator":"count","createBuckets":"by_lecture_participation","bucketAggregator":"presence_of_events","valueToAchieve":25}}'
            ),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Global_Courses,
            group: 'student_conduct_course_appointment',
            groupOrder: 1,
            sequentialStepName: null,
            type: achievement_type_enum.TIERED,
            title: '1 durchgeführter Termin',
            tagline: 'Gruppenkurse',
            description:
                'Sobald du einen Kurs-Termin erfolgreich durchgeführt hast; geht die Reise mit unserer Eule Loki weiter. Bleib dran und schließe alle Termine ab; um zu sehen wohin dich die Reise als Nächstes führt.',
            achievedDescription:
                'Fantastisch! Du hast heute deinen ersten Termin in einem Gruppenkurs gegeben. Wir sind uns sicher; dass dieser Termin eine wertvolle Erfahrung für die Teilnehmer:innen war und sie auf ihrer Lernreise vorangebracht hat. Das neu gewonnene Wissen kann sie nun zu neuen Horizonten führen. Auch unsere Eule Loki geht gemeinsam mit Freunden auf Reisen. Fliegt gemeinsam weiter und erkundet die Welt des Wissens! ',
            image: 'gamification/achievements/tmp/x_group_lectures_held/one_group_lectures_held.jpg',
            achievedImage: null,
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedFooter: 'Wow! Du hast alle Termine abgeschlossen.',
            condition: 'student_course_appointments_count > 0',
            conditionDataAggregations: JSON.parse(
                '{"student_course_appointments_count":{"metric":"student_conducted_subcourse_appointment","aggregator":"count","createBuckets":"by_lecture_participation","bucketAggregator":"presence_of_events","valueToAchieve":1}}'
            ),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Global_Courses,
            group: 'student_conduct_course_appointment',
            groupOrder: 2,
            sequentialStepName: null,
            type: achievement_type_enum.TIERED,
            title: '3 durchgeführte Termine',
            tagline: 'Gruppenkurse',
            description:
                'Sobald du drei Kurs-Termine erfolgreich durchgeführt hast; geht die Reise mit unserer Eule Loki weiter. Bleib dran und schließe alle Termine ab; um zu sehen wohin dich die Reise als Nächstes führt.',
            achievedDescription:
                'Wunderbar! Du hast drei Termine in Gruppenkursen durchgeführt. Damit bist du und die Teilnehmer:innen auf eurer gemeinsamen Lernreise schon weit gekommen. Loki reist gerade mit seinen Freunden in einem Auto. Wir sind gespannt; wo Lokis Reise hinführt und welche Stationen die nächsten auf eurer Lernreise sein werden. Weiter geht’s!',
            image: 'gamification/achievements/tmp/x_group_lectures_held/three_group_lectures_held.jpg',
            achievedImage: null,
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedFooter: 'Wow! Du hast alle Termine abgeschlossen.',
            condition: 'student_course_appointments_count > 2',
            conditionDataAggregations: JSON.parse(
                '{"student_course_appointments_count":{"metric":"student_conducted_subcourse_appointment","aggregator":"count","createBuckets":"by_lecture_participation","bucketAggregator":"presence_of_events","valueToAchieve":3}}'
            ),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Global_Courses,
            group: 'student_conduct_course_appointment',
            groupOrder: 3,
            sequentialStepName: null,
            type: achievement_type_enum.TIERED,
            title: '5 durchgeführte Termine',
            tagline: 'Gruppenkurse',
            description:
                'Sobald du fünf Kurs-Termine erfolgreich durchgeführt hast; geht die Reise mit unserer Eule Loki weiter. Bleib dran und schließe alle Termine ab; um zu sehen wohin dich die Reise als Nächstes führt.',
            achievedDescription:
                'Super! Du hast schon fünf Termine in Gruppenkursen veranstaltet. Wir hoffen; dass du und die Teilnehmer:innen eine spannende Lernreise habt und dabei viel Neues entdeckt. Loki hat auf der Reise ein neues Fortbewegungsmittel für sich entdeckt und paddelt nun gemeinsam mit Freunden in einem kleinen Boot; auch Gondel genannt; über Wasserkanäle. Bleibt neugierig und erlebt weitere Lern-Abenteuer!',
            image: 'gamification/achievements/tmp/x_group_lectures_held/five_group_lectures_held.jpg',
            achievedImage: null,
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedFooter: 'Wow! Du hast alle Termine abgeschlossen.',
            condition: 'student_course_appointments_count > 4',
            conditionDataAggregations: JSON.parse(
                '{"student_course_appointments_count":{"metric":"student_conducted_subcourse_appointment","aggregator":"count","createBuckets":"by_lecture_participation","bucketAggregator":"presence_of_events","valueToAchieve":5}}'
            ),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Global_Courses,
            group: 'student_conduct_course_appointment',
            groupOrder: 4,
            sequentialStepName: null,
            type: achievement_type_enum.TIERED,
            title: '10 durchgeführte Termine',
            tagline: 'Gruppenkurse',
            description:
                'Sobald du zehn Kurs-Termine erfolgreich durchgeführt hast; geht die Reise mit unserer Eule Loki weiter. Bleib dran und schließe alle Termine ab; um zu sehen wohin dich die Reise als Nächstes führt.',
            achievedDescription:
                'Klasse! Zehn Termine in Gruppenkursen liegen hinter dir und den Kursteilnehmer:innen. Dabei habt ihr bestimmt viel Neues gelernt und entdeckt. Loki macht auf der Reise gerade Halt in einer großen Stadt. Hier ist sehr viel los. Deshalb gibt es immer etwas zu beobachten und zu lernen für Loki. Was schaut ihr euch als nächstes an?',
            image: 'gamification/achievements/tmp/x_group_lectures_held/ten_group_lectures_held.jpg',
            achievedImage: null,
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedFooter: 'Wow! Du hast alle Termine abgeschlossen.',
            condition: 'student_course_appointments_count > 9',
            conditionDataAggregations: JSON.parse(
                '{"student_course_appointments_count":{"metric":"student_conducted_subcourse_appointment","aggregator":"count","createBuckets":"by_lecture_participation","bucketAggregator":"presence_of_events","valueToAchieve":10}}'
            ),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Global_Courses,
            group: 'student_conduct_course_appointment',
            groupOrder: 5,
            sequentialStepName: null,
            type: achievement_type_enum.TIERED,
            title: '15 durchgeführte Termine',
            tagline: 'Gruppenkurse',
            description:
                'Sobald du 15 Kurs-Termine erfolgreich durchgeführt hast; geht die Reise mit unserer Eule Loki weiter. Bleib dran und schließe alle Termine ab; um zu sehen wohin dich die Reise als Nächstes führt.',
            achievedDescription:
                'Großartig! In den vergangenen 15 Gruppenkursterminen haben du und die Kursteilnehmer:innen viel neues Wissen aufgebaut. Das ist mindestens genauso toll wie die Sandburgen; die Loki auf der Reise mit Freunden am Strand gebaut hat. Ihr könnt sehr zufrieden sein mit dem; was ihr bisher erreicht habt. Macht weiter so!',
            image: 'gamification/achievements/tmp/x_group_lectures_held/fifteen_group_lectures_held.jpg',
            achievedImage: null,
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedFooter: 'Wow! Du hast alle Termine abgeschlossen.',
            condition: 'student_course_appointments_count > 14',
            conditionDataAggregations: JSON.parse(
                '{"student_course_appointments_count":{"metric":"student_conducted_subcourse_appointment","aggregator":"count","createBuckets":"by_lecture_participation","bucketAggregator":"presence_of_events","valueToAchieve":15}}'
            ),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Global_Courses,
            group: 'student_conduct_course_appointment',
            groupOrder: 6,
            sequentialStepName: null,
            type: achievement_type_enum.TIERED,
            title: '25 durchgeführte Termine',
            tagline: 'Gruppenkurse',
            description:
                'Sobald du 25 Kurs-Termine erfolgreich durchgeführt hast; geht die Reise mit unserer Eule Loki weiter. Bleib dran und schließe alle Termine ab; um zu sehen wohin dich die Reise als Nächstes führt.',
            achievedDescription:
                'Wow! Beeindruckende 25 Termine in Gruppenkursen liegen nun hinter euch. Wir sind uns sicher; dass du und die Kursteilnehmer:innen dabei sehr viel gelernt und erlebt habt. Das ist ein guter Zeitpunkt; um sich daran zu erinnern. Auch Loki schaut auf viele tolle Erlebnisse während der Reise zurück und fliegt mit den Freunden weiter. Halte weitere Kurstermine und fliege auch du gemeinsam mit den Teilnehmer:innen weiter!',
            image: 'gamification/achievements/tmp/x_group_lectures_held/twentyfive_group_lectures_held.jpg',
            achievedImage: null,
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedFooter: 'Wow! Du hast alle Termine abgeschlossen.',
            condition: 'student_course_appointments_count > 24',
            conditionDataAggregations: JSON.parse(
                '{"student_course_appointments_count":{"metric":"student_conducted_subcourse_appointment","aggregator":"count","createBuckets":"by_lecture_participation","bucketAggregator":"presence_of_events","valueToAchieve":25}}'
            ),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Course,
            group: 'student_offer_course',
            groupOrder: 1,
            sequentialStepName: 'Kurs entwerfen',
            type: achievement_type_enum.SEQUENTIAL,
            title: 'Neuer Kurs',
            tagline: '{{course.Name}}',
            description:
                'Wir freuen uns; wenn du einen Kurs auf unserer Plattform anbieten möchtest! Im Hilfestellungsbereich findest du unsere informativen Schulungs- und Erklärvideos; die dir den Einstieg erleichtern. Falls du Unterstützung benötigst; kannst du dort gerne einen Beratungstermin mit unserem pädagogischen Team buchen. Wir stehen bereit; um dich bei der Konzeption deines Kurses zu unterstützen und dir wertvolle Tipps zu geben. Dein Engagement bedeutet uns viel – wir können es kaum erwarten; gemeinsam mit dir neue Kurse zu entwefen und die Plattform zu bereichern!',
            achievedDescription: null,
            image: 'course-image',
            achievedImage: null,
            actionName: 'Kurs entwerfen',
            actionRedirectLink: 'Link direkt in den Kurserstellungsprozess',
            actionType: null,
            achievedFooter: null,
            condition: 'student_create_course_events > 0',
            conditionDataAggregations: JSON.parse('{"student_create_course_events":{"metric":"student_create_course","aggregator":"count"}}'),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Course,
            group: 'student_offer_course',
            groupOrder: 2,
            sequentialStepName: 'Kurs zur Prüfung freigeben',
            type: achievement_type_enum.SEQUENTIAL,
            title: 'Neuer Kurs',
            tagline: '{{course.Name}}',
            description:
                'Hurra; du hast den Kurs “{{course.Name}}” erfolgreich erstellt. Damit er auf unserer Plattform veröffentlicht werden kann; musst du den Kurs zunächst zur Prüfung freigeben. Wir prüfen deinen Kurs dann innerhalb weniger Tage und veröffentlichen ihn dann automatisch für alle Schüler:innen.',
            achievedDescription: null,
            image: 'course-image',
            achievedImage: null,
            actionName: 'Kurs zur Prüfung freigeben',
            actionRedirectLink: 'Link auf Kurs-Detailseite',
            actionType: null,
            achievedFooter: null,
            condition: 'student_submit_course_events > 0',
            conditionDataAggregations: JSON.parse('{"student_submit_course_events":{"metric":"student_submit_course","aggregator":"count"}}'),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Course,
            group: 'student_offer_course',
            groupOrder: 3,
            sequentialStepName: 'Freigabe erhalten',
            type: achievement_type_enum.SEQUENTIAL,
            title: 'Neuer Kurs',
            tagline: '{{course.Name}}',
            description:
                'Dein Kurs “{{course.Name}}” wird derzeit von unserem Team überprüft. Wir können es kaum erwarten; ihn für alle Schüler:innen zur Anmeldung freizuschalten und damit das Wissensangebot für unsere Lerncommunity zu erweitern. Wir melden uns umgehend bei dir sobald dein Kurs online ist!',
            achievedDescription:
                'Juhu! Dein Kurs “{{course.Name}}” ist veröffentlicht! Wir haben direkt nach der Freischaltung passende Schüler:innen auf deinen Kurs aufmerksam gemacht und rühren nun die Werbetrommel in unserer Community. Du kannst die Anmeldungen zu deinem Kurs jederzeit einsehen und live verfolgen; wie sich die Lernbegeisterten einschreiben. Vielen Dank für deinen wertvollen Beitrag zu unserer Lernplattform!',
            image: 'course-image',
            achievedImage: null,
            actionName: 'Kurs veröffentlichen',
            actionRedirectLink: 'Link auf Kurs-Detailseite',
            actionType: null,
            achievedFooter: 'Wow! Du hast alle Schritte abgeschlossen.',
            condition: 'student_approve_course_events > 0',
            conditionDataAggregations: JSON.parse('{"student_approve_course_events":{"metric":"student_approve_course","aggregator":"count"}}'),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Course,
            group: 'student_course_participation',
            groupOrder: 1,
            sequentialStepName: 'Kurs anbieten',
            type: achievement_type_enum.SEQUENTIAL,
            title: 'Kurs erstellt',
            tagline: '{{course.Name}}',
            description: 'This is not in use',
            achievedDescription: null,
            image: 'course-image',
            achievedImage: null,
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedFooter: 'This is not in use',
            condition: 'student_offer_course > 0',
            conditionDataAggregations: JSON.parse('{"student_offer_course":{"metric":"student_offer_course","aggregator":"count"}}'),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Course,
            group: 'student_course_participation',
            groupOrder: 2,
            sequentialStepName: 'Kurs Beenden',
            type: achievement_type_enum.SEQUENTIAL,
            title: 'Kurs erfolgreich beendet',
            tagline: '{{course.Name}}',
            description:
                'Du erhältst diesen Erfolg sobald alle Termine deines Kurses "{{course.Name}}" beendet wurden. Kontinuierliche Termine ermöglichen den Schüler:innen nicht nur; das Beste aus dem Kurs herauszuholen; sondern stärken auch ihre Lernfortschritte und das Verständnis der Kursinhalte.',
            achievedDescription:
                'Herzlichen Glückwunsch zum erfolgreichen Abschluss des letzten Termins deines Kurses {{course.name}}! Wir hoffen; die Kursleitung hat dir viel Freude bereitet und dass die Schüler:innen viel mitnehmen konnten. Dein Feedback ist uns sehr wichtig – wir freuen uns darauf; von deinen Erfahrungen zu hören! ',
            image: 'course-image',
            achievedImage: null,
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedFooter: 'Wow! Du hast den Kurs abgeschlossen.',
            condition: 'student_conducted_subcourse_appointment > 0',
            conditionDataAggregations: JSON.parse(
                '{"student_conducted_subcourse_appointment":{"metric":"student_conducted_subcourse_appointment","aggregator":"at_least_one_event_per_bucket","createBuckets":"by_lecture_participation","bucketAggregator":"presence_of_events"}}'
            ),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Match,
            group: 'student_match_regular_learning',
            groupOrder: 1,
            sequentialStepName: null,
            type: achievement_type_enum.STREAK,
            title: 'Rhythmus-Rekord',
            tagline: 'Nachhilfe mit {{pupil.firstname}}',
            description:
                'Um diese Serie aufrechtzuerhalten; setze deine gemeinsamen Lernsessions mit {{name}} weiter fort. Regelmäßiges Lernen bringt eine Fülle an Vorteilen mit sich; von verbessertem Wissen und Verständnis bis hin zu gesteigerter Effizienz und Selbstvertrauen. Ihr seid definitiv auf dem richtigen Weg; um eure Ziele zu erreichen!',
            achievedDescription: null,
            image: 'gamification/achievements/tmp/streaks/regular_learning_set.png',
            achievedImage: 'gamification/achievements/tmp/streaks/regular_learning_achieved.png',
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedFooter: 'Hurra; du erhöhst deinen Rekord weiter!',
            condition: 'student_match_learning_events > recordValue',
            conditionDataAggregations: JSON.parse(
                '{"student_match_learning_events":{"metric":"student_match_learned_regular","aggregator":"last_streak_length","createBuckets":"by_weeks","bucketAggregator":"presence_of_events"}}'
            ),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Global,
            group: 'student_appointment_reliability',
            groupOrder: 1,
            sequentialStepName: null,
            type: achievement_type_enum.STREAK,
            title: 'Pünktlichkeits-Power',
            tagline: 'Zur richtigen Uhrzeit',
            description:
                'Halte diesen tollen Trend aufrecht und baue ihn weiter aus. Jedes Mal; wenn du innerhalb der ersten 5 Minuten zum Termin erscheinst; steigt deine Erfolgsstreak. Mit deiner Pünktlichkeit wie ein Uhrwerk bist du auf dem besten Weg zum:r Pünktlichkeits-Meister:in. Weiter so; du bist auf dem richtigen Kurs!',
            achievedDescription: null,
            image: 'gamification/achievements/tmp/streaks/punctuality_set.png',
            achievedImage: 'gamification/achievements/tmp/streaks/punctuality_achieved.png',
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedFooter: 'Hurra; du erhöhst deinen Rekord weiter!',
            condition: 'student_participated_in_meeting > recordValue',
            conditionDataAggregations: JSON.parse(
                '{"student_participated_in_meeting":{"metric":"student_participated_in_meeting","aggregator":"last_streak_length","createBuckets":"by_lecture_start","bucketAggregator":"presence_of_events"}}'
            ),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Global,
            group: 'pupil_onboarding',
            groupOrder: 1,
            sequentialStepName: 'Verifizieren',
            type: achievement_type_enum.SEQUENTIAL,
            title: 'Onboarding',
            tagline: 'Willkommen bei Lern-Fair 👋',
            description:
                'Hurra! Am {{date}} haben wir eine E-Mail an deine Adresse {{email}} gesendet. Um deine E-Mail zu bestätigen; klicke einfach auf den Button in der Nachricht. Solltest du unsere E-Mail nicht finden; kannst du hier eine erneute Zustellung anfordern und voller Vorfreude auf unser Weiterkommen warten.',
            achievedDescription: null,
            image: 'gamification/achievements/tmp/finish_onboarding/two_pieces/empty_state.png',
            achievedImage: null,
            actionName: 'E-Mail verifizieren',
            actionRedirectLink: 'Verifizierungsmail senden?',
            actionType: null,
            achievedFooter: null,
            condition: 'pupil_verified_events > 0',
            conditionDataAggregations: JSON.parse('{"pupil_verified_events":{"metric":"pupil_onboarding_verified","aggregator":"count"}}'),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Global,
            group: 'pupil_onboarding',
            groupOrder: 2,
            sequentialStepName: 'Screening absolvieren',
            type: achievement_type_enum.SEQUENTIAL,
            title: 'Onboarding',
            tagline: 'Willkommen bei Lern-Fair 👋',
            description:
                'Wir sind gespannt darauf; dich kennenzulernen! In einem kurzen; 15-minütigen Zoom-Gespräch möchten wir dir gerne unsere vielfältigen kostenlose Angebote vorstellen und dir die beste Unterstützung ermöglichen sowie alle deine Fragen beantworten. Buche einfach einen Termin; um mehr zu erfahren und dann voller Tatendrang direkt durchzustarten. Falls dir etwas dazwischen kommt; sage den Termin bitte ab und buche dir einen neuen.',
            achievedDescription:
                'Herzlichen Glückwunsch! Du hast alle Onboarding-Schritte erfolgreich gemeistert und dir das Abflugticket für Loki gesichert. Wir sind begeistert; dass du nun Teil unserer Lerncommunity bist und hoffen dich gut auf deiner Lernreise begleiten zu können. Loki und unser Team werden immer für dich da sein!',
            image: 'gamification/achievements/tmp/finish_onboarding/two_pieces/step_1.png',
            achievedImage: 'gamification/achievements/tmp/finish_onboarding/two_pieces/step_2.png',
            actionName: 'Kennenlerngespräch absolvieren',
            actionRedirectLink: 'Calendly SuS Erstgespräch',
            actionType: null,
            achievedFooter: null,
            condition: 'pupil_screened_events > 0',
            conditionDataAggregations: JSON.parse('{"pupil_screened_events":{"metric":"pupil_onboarding_screened","aggregator":"count"}}'),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Global_Matches,
            group: 'pupil_conduct_match_appointment',
            groupOrder: 1,
            sequentialStepName: null,
            type: achievement_type_enum.TIERED,
            title: '1 durchgeführter Termin',
            tagline: '1:1-Nachhilfe',
            description:
                'Sobald du einen Nachhilfe-Termin erfolgreich durchgeführt hast; geht die Reise mit unserer Eule Loki weiter. Bleib dran und schließe alle Termine ab; um zu sehen wohin euch die Lernreise als Nächstes führt.',
            achievedDescription:
                'Super! Du hattest deinen ersten Termin in der Lernunterstützung. Bleib am Ball und setze deine Lernreise motiviert fort. Genau wie unsere Eule Loki noch eine lange Reise vor sich hat; gibt es auch für dich noch vieles zu lernen. Wir hoffen; dass du beim Lernen genauso viel Spaß haben wirst wie Loki beim Paddeln.',
            image: 'gamification/achievements/tmp/x_lectures_held/one_lectures_held.jpg',
            achievedImage: null,
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedFooter: 'Wow! Du hast alle Termine abgeschlossen.',
            condition: 'pupil_match_appointments_count > 0',
            conditionDataAggregations: JSON.parse(
                '{"pupil_match_appointments_count":{"metric":"pupil_conducted_match_appointment","aggregator":"count","createBuckets":"by_lecture_participation","bucketAggregator":"presence_of_events","valueToAchieve":1}}'
            ),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Global_Matches,
            group: 'pupil_conduct_match_appointment',
            groupOrder: 2,
            sequentialStepName: null,
            type: achievement_type_enum.TIERED,
            title: '3 durchgeführte Termine',
            tagline: '1:1-Nachhilfe',
            description:
                'Sobald du drei Nachhilfe-Termine erfolgreich durchgeführt hast; geht die Reise mit unserer Eule Loki weiter. Bleib dran und schließe alle Termine ab; um zu sehen wohin euch die Lernreise als Nächstes führt.',
            achievedDescription:
                'Prima! Du hast nun schon drei Termine in der Lernunterstützung gehabt. Schön; dass du deine Lernreise so fleißig startest. Lokis Reise führt heute vorbei an einem schönen; blühenden Kirschbaum. Auch der Baum hat einmal klein angefangen. Genauso wie der Baum gewachsen ist; wächst auch dein Wissen mit jedem Termin in der Lernunterstützung. Also mach weiter so!',
            image: 'gamification/achievements/tmp/x_lectures_held/three_lectures_held.jpg',
            achievedImage: null,
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedFooter: 'Wow! Du hast alle Termine abgeschlossen.',
            condition: 'pupil_match_appointments_count > 2',
            conditionDataAggregations: JSON.parse(
                '{"pupil_match_appointments_count":{"metric":"pupil_conducted_match_appointment","aggregator":"count","createBuckets":"by_lecture_participation","bucketAggregator":"presence_of_events","valueToAchieve":3}}'
            ),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Global_Matches,
            group: 'pupil_conduct_match_appointment',
            groupOrder: 3,
            sequentialStepName: null,
            type: achievement_type_enum.TIERED,
            title: '5 durchgeführte Termine',
            tagline: '1:1-Nachhilfe',
            description:
                'Sobald du fünf Nachhilfe-Termine erfolgreich durchgeführt hast; geht die Reise mit unserer Eule Loki weiter. Bleib dran und schließe alle Termine ab; um zu sehen wohin euch die Lernreise als Nächstes führt.',
            achievedDescription:
                'Klasse! Fünf Termine in der Lernunterstützung hast du schon geschafft. Damit bist du auf deiner Lernreise schon weit gekommen. Loki schützt sich auf der Reise vor der Kälte in einem Iglu; das aus Eis gebaut wurde. Baue auch du weiter an deinem Wissensschatz; indem du weitere Termine in der Lernunterstützung machst. Tolle Arbeit; mach weiter!',
            image: 'gamification/achievements/tmp/x_lectures_held/five_lectures_held.jpg',
            achievedImage: null,
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedFooter: 'Wow! Du hast alle Termine abgeschlossen.',
            condition: 'pupil_match_appointments_count > 4',
            conditionDataAggregations: JSON.parse(
                '{"pupil_match_appointments_count":{"metric":"pupil_conducted_match_appointment","aggregator":"count","createBuckets":"by_lecture_participation","bucketAggregator":"presence_of_events","valueToAchieve":5}}'
            ),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Global_Matches,
            group: 'pupil_conduct_match_appointment',
            groupOrder: 4,
            sequentialStepName: null,
            type: achievement_type_enum.TIERED,
            title: '10 durchgeführte Termine',
            tagline: '1:1-Nachhilfe',
            description:
                'Sobald du zehn Nachhilfe-Termine erfolgreich durchgeführt hast; geht die Reise mit unserer Eule Loki weiter. Bleib dran und schließe alle Termine ab; um zu sehen wohin euch die Lernreise als Nächstes führt.',
            achievedDescription:
                'Beeindruckend! Nun hast du schon zehn Termine in der Lernunterstützung wahrgenommen und setzt deine Lernreise immer weiter fort. Loki befindet sich aktuell in der Wüste und ist beeindruckt von den unendlichen Weiten. Ähnlich wie in einer Wüste gibt es beim Lernen immer neue Möglichkeiten; weiter zu gehen. Und mit jedem Termin in der Lernunterstützung kannst du Neues entdecken und dein Wissen erweitern. Bleib dran!',
            image: 'gamification/achievements/tmp/x_lectures_held/ten_lectures_held.jpg',
            achievedImage: null,
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedFooter: 'Wow! Du hast alle Termine abgeschlossen.',
            condition: 'pupil_match_appointments_count > 9',
            conditionDataAggregations: JSON.parse(
                '{"pupil_match_appointments_count":{"metric":"pupil_conducted_match_appointment","aggregator":"count","createBuckets":"by_lecture_participation","bucketAggregator":"presence_of_events","valueToAchieve":10}}'
            ),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Global_Matches,
            group: 'pupil_conduct_match_appointment',
            groupOrder: 5,
            sequentialStepName: null,
            type: achievement_type_enum.TIERED,
            title: '15 durchgeführte Termine',
            tagline: '1:1-Nachhilfe',
            description:
                'Sobald du 15 Nachhilfe-Termine erfolgreich durchgeführt hast; geht die Reise mit unserer Eule Loki weiter. Bleib dran und schließe alle Termine ab; um zu sehen wohin euch die Lernreise als Nächstes führt.',
            achievedDescription:
                'Absolut großartig! 15-mal hast du nun schon in der Lernunterstützung gelernt. Genau wie die Heißluftballons; die Loki auf der Reise entdeckt hat; steigt dein Wissen durch Lernen. Jedes Mal; wenn du gemeinsam mit deinem:r Lernpartner:in lernst; füllt sich der Ballon deines Wissens mit heißer Luft und hebt ab in neue Höhen. Je mehr Wissen angesammelt wird; desto höher steigt der Ballon und desto mehr kannst du in der Ferne entdecken. Bleib dabei und flieg weiter mit Loki!',
            image: 'gamification/achievements/tmp/x_lectures_held/fifteen_lectures_held.jpg',
            achievedImage: null,
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedFooter: 'Wow! Du hast alle Termine abgeschlossen.',
            condition: 'pupil_match_appointments_count > 14',
            conditionDataAggregations: JSON.parse(
                '{"pupil_match_appointments_count":{"metric":"pupil_conducted_match_appointment","aggregator":"count","createBuckets":"by_lecture_participation","bucketAggregator":"presence_of_events","valueToAchieve":15}}'
            ),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Global_Matches,
            group: 'pupil_conduct_match_appointment',
            groupOrder: 6,
            sequentialStepName: null,
            type: achievement_type_enum.TIERED,
            title: '25 durchgeführte Termine',
            tagline: '1:1-Nachhilfe',
            description:
                'Sobald du 25 Nachhilfe-Termine erfolgreich durchgeführt hast; geht die Reise mit unserer Eule Loki weiter. Bleib dran und schließe alle Termine ab; um zu sehen wohin euch die Lernreise als Nächstes führt.',
            achievedDescription:
                'Wow! Unglaubliche 25 Termine in der Lernunterstützung liegen jetzt schon hinter dir. Das ist wirklich beeindruckend und ein guter Zeitpunkt; um auf deine bisherige Lernreise zurückzublicken. Du kannst dir gemeinsam mit Loki die Nordlichter auf dem Bild anschauen und daran denken; was du schon alles gemeinsam mit deiner:m Lernpartner:in erreicht hast. Gut gemacht; mach weiter so!',
            image: 'gamification/achievements/tmp/x_lectures_held/twentyfive_lectures_held.jpg',
            achievedImage: null,
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedFooter: 'Wow! Du hast alle Termine abgeschlossen.',
            condition: 'pupil_match_appointments_count > 24',
            conditionDataAggregations: JSON.parse(
                '{"pupil_match_appointments_count":{"metric":"pupil_conducted_match_appointment","aggregator":"count","createBuckets":"by_lecture_participation","bucketAggregator":"presence_of_events","valueToAchieve":25}}'
            ),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Global_Courses,
            group: 'pupil_conduct_course_appointment',
            groupOrder: 1,
            sequentialStepName: null,
            type: achievement_type_enum.TIERED,
            title: '1 durchgeführter Termin',
            tagline: 'Gruppenkurse',
            description:
                'Sobald du einen Kurs-Termin erfolgreich durchgeführt hast; geht die Reise mit unserer Eule Loki weiter. Bleib dran und schließe alle Termine ab; um zu sehen wohin dich die Reise als Nächstes führt.',
            achievedDescription:
                'Fantastisch! Du hast heute an deinem ersten Termin in einem Gruppenkurs teilgenommen. Wir hoffen; dass du viel gelernt hast und dass dieser Termin dich auf deiner Lernreise vorangebracht hat. Gemeinsam mit den anderen Teilnehmer:innen kann euch euer neu gewonnenes Wissen zu neuen Horizonten führen. Auch unsere Eule Loki geht gemeinsam mit Freunden auf Reisen. Lass uns gemeinsam fliegen und die Welt des Wissens erkunden!',
            image: 'gamification/achievements/tmp/x_group_lectures_held/one_group_lectures_held.jpg',
            achievedImage: null,
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedFooter: 'Wow! Du hast alle Termine abgeschlossen.',
            condition: 'pupil_course_appointments_count > 0',
            conditionDataAggregations: JSON.parse(
                '{"pupil_course_appointments_count":{"metric":"pupil_conducted_subcourse_appointment","aggregator":"count","createBuckets":"by_lecture_participation","bucketAggregator":"presence_of_events","valueToAchieve":1}}'
            ),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Global_Courses,
            group: 'pupil_conduct_course_appointment',
            groupOrder: 2,
            sequentialStepName: null,
            type: achievement_type_enum.TIERED,
            title: '3 durchgeführte Termine',
            tagline: 'Gruppenkurse',
            description:
                'Sobald du drei Kurs-Termine erfolgreich durchgeführt hast; geht die Reise mit unserer Eule Loki weiter. Bleib dran und schließe alle Termine ab; um zu sehen wohin dich die Reise als Nächstes führt.',
            achievedDescription:
                'Wunderbar! Du hast an drei Terminen eines Gruppenkurses teilgenommen. Damit bist du und die anderen Teilnehmer:innen auf eurer gemeinsamen Lernreise schon weit gekommen. Loki reist gerade mit seinen Freunden in einem Auto. Wir sind gespannt; wo Lokis Reise hinführt und welche Stationen die nächsten auf eurer Lernreise sein werden. Weiter geht’s!',
            image: 'gamification/achievements/tmp/x_group_lectures_held/three_group_lectures_held.jpg',
            achievedImage: null,
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedFooter: 'Wow! Du hast alle Termine abgeschlossen.',
            condition: 'pupil_course_appointments_coun > 2',
            conditionDataAggregations: JSON.parse(
                '{"pupil_course_appointments_count":{"metric":"pupil_conducted_subcourse_appointment","aggregator":"count","createBuckets":"by_lecture_participation","bucketAggregator":"presence_of_events","valueToAchieve":3}}'
            ),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Global_Courses,
            group: 'pupil_conduct_course_appointment',
            groupOrder: 3,
            sequentialStepName: null,
            type: achievement_type_enum.TIERED,
            title: '5 durchgeführte Termine',
            tagline: 'Gruppenkurse',
            description:
                'Sobald du fünf Kurs-Termine erfolgreich durchgeführt hast; geht die Reise mit unserer Eule Loki weiter. Bleib dran und schließe alle Termine ab; um zu sehen wohin dich die Reise als Nächstes führt.',
            achievedDescription:
                'Super! Du hast schon fünf Termine eines Gruppenkurses besucht. Wir hoffen; dass du eine spannende Lernreise hast und dabei viel Neues entdeckst. Loki hat auf der Reise ein neues Fortbewegungsmittel für sich entdeckt und paddelt nun gemeinsam mit Freunden in einem kleinen Boot; auch Gondel genannt; über Wasserkanäle. Bleib neugierig und erlebe neue Lern-Abenteuer!',
            image: 'gamification/achievements/tmp/x_group_lectures_held/five_group_lectures_held.jpg',
            achievedImage: null,
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedFooter: 'Wow! Du hast alle Termine abgeschlossen.',
            condition: 'pupil_course_appointments_count > 4',
            conditionDataAggregations: JSON.parse(
                '{"pupil_course_appointments_count":{"metric":"pupil_conducted_subcourse_appointment","aggregator":"count","createBuckets":"by_lecture_participation","bucketAggregator":"presence_of_events","valueToAchieve":5}}'
            ),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Global_Courses,
            group: 'pupil_conduct_course_appointment',
            groupOrder: 4,
            sequentialStepName: null,
            type: achievement_type_enum.TIERED,
            title: '10 durchgeführte Termine',
            tagline: 'Gruppenkurse',
            description:
                'Sobald du zehn Kurs-Termine erfolgreich durchgeführt hast; geht die Reise mit unserer Eule Loki weiter. Bleib dran und schließe alle Termine ab; um zu sehen wohin dich die Reise als Nächstes führt.',
            achievedDescription:
                'Klasse! Zehn Kurstermine in Gruppenkursen liegen hinter dir und den anderen Kursteilnehmer:innen. Dabei habt ihr bestimmt viel Neues gelernt und entdeckt. Loki macht auf der Reise gerade Halt in einer großen Stadt. Hier ist sehr viel los. Deshalb gibt es immer etwas zu beobachten und zu lernen für Loki. Was schaust du dir als nächstes an?',
            image: 'gamification/achievements/tmp/x_group_lectures_held/ten_group_lectures_held.jpg',
            achievedImage: null,
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedFooter: 'Wow! Du hast alle Termine abgeschlossen.',
            condition: 'pupil_course_appointments_count > 9',
            conditionDataAggregations: JSON.parse(
                '{"pupil_course_appointments_count":{"metric":"pupil_conducted_subcourse_appointment","aggregator":"count","createBuckets":"by_lecture_participation","bucketAggregator":"presence_of_events","valueToAchieve":10}}'
            ),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Global_Courses,
            group: 'pupil_conduct_course_appointment',
            groupOrder: 5,
            sequentialStepName: null,
            type: achievement_type_enum.TIERED,
            title: '15 durchgeführte Termine',
            tagline: 'Gruppenkurse',
            description:
                'Sobald du 15 Kurs-Termine erfolgreich durchgeführt hast; geht die Reise mit unserer Eule Loki weiter. Bleib dran und schließe alle Termine ab; um zu sehen wohin dich die Reise als Nächstes führt.',
            achievedDescription:
                'Großartig! In den vergangenen 15 Gruppenkursterminen haben du und die anderen Kursteilnehmer:innen viel neues Wissen aufgebaut. Das ist mindestens genauso toll wie die Sandburgen; die Loki auf der Reise mit Freunden am Strand gebaut hat. Ihr könnt sehr zufrieden sein mit dem; was ihr bisher erreicht habt. Macht weiter so!',
            image: 'gamification/achievements/tmp/x_group_lectures_held/fifteen_group_lectures_held.jpg',
            achievedImage: null,
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedFooter: 'Wow! Du hast alle Termine abgeschlossen.',
            condition: 'pupil_course_appointments_count > 14',
            conditionDataAggregations: JSON.parse(
                '{"pupil_course_appointments_count":{"metric":"pupil_conducted_subcourse_appointment","aggregator":"count","createBuckets":"by_lecture_participation","bucketAggregator":"presence_of_events","valueToAchieve":15}}'
            ),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Global_Courses,
            group: 'pupil_conduct_course_appointment',
            groupOrder: 6,
            sequentialStepName: null,
            type: achievement_type_enum.TIERED,
            title: '25 durchgeführte Termine',
            tagline: 'Gruppenkurse',
            description:
                'Sobald du 25 Kurs-Termine erfolgreich durchgeführt hast; geht die Reise mit unserer Eule Loki weiter. Bleib dran und schließe alle Termine ab; um zu sehen wohin dich die Reise als Nächstes führt.',
            achievedDescription:
                'Wow! Beeindruckende 25 Gruppenkurstermine liegen nun hinter dir. Wir sind uns sicher; dass du und die anderen Kursteilnehmer:innen dabei sehr viel gelernt und erlebt habt. Das ist ein guter Zeitpunkt; um sich daran zu erinnern. Auch Loki schaut auf viele tolle Erlebnisse während der Reise zurück und fliegt mit den Freunden weiter. Besuche weitere Kurstermine und fliege auch du gemeinsam mit anderen Teilnehmer:innen weiter!',
            image: 'gamification/achievements/tmp/x_group_lectures_held/twentyfive_group_lectures_held.jpg',
            achievedImage: null,
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedFooter: 'Wow! Du hast alle Termine abgeschlossen.',
            condition: 'pupil_course_appointments_count > 24',
            conditionDataAggregations: JSON.parse(
                '{"pupil_course_appointments_count":{"metric":"pupil_conducted_subcourse_appointment","aggregator":"count","createBuckets":"by_lecture_participation","bucketAggregator":"presence_of_events","valueToAchieve":25}}'
            ),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Course,
            group: 'pupil_course_participation',
            groupOrder: 1,
            sequentialStepName: 'An Kurs Teilnehmen',
            type: achievement_type_enum.SEQUENTIAL,
            title: 'Kurs beigetreten',
            tagline: '{{course.Name}}',
            description: 'This is not in use',
            achievedDescription: null,
            image: 'course-image',
            achievedImage: null,
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedFooter: 'This is not in use',
            condition: 'pupil_course_joined > 0',
            conditionDataAggregations: JSON.parse('{"pupil_course_joined":{"metric":"pupil_course_joined","aggregator":"count"}}'),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Course,
            group: 'pupil_course_participation',
            groupOrder: 2,
            sequentialStepName: 'Kurs Beenden',
            type: achievement_type_enum.SEQUENTIAL,
            title: 'Kurs erfolgreich beendet',
            tagline: '{{course.Name}}',
            description:
                'Um diesen Erfolg zu erhalten; sei bei allen Terminen des Kurses {{course.name}} dabei. Die kontinuierliche Teilnahme ermöglicht dir nicht nur; das Beste aus dem Kurs herauszuholen; sondern stärkt auch deine Lernfortschritte und das Verständnis der Kursinhalte. Du bist auf dem richtigen Weg; bleib dran!',
            achievedDescription:
                'Herzlichen Glückwunsch zum erfolgreichen Abschluss des letzten Termins des Kurses {{course.Name}}! Wir hoffen; dir hat der Kurs viel Freude bereitet und dass du etwas mitnehmen konntest. Dein Feedback ist uns sehr wichtig – wir freuen uns darauf; von deinen Erfahrungen zu hören! ',
            image: 'course-image',
            achievedImage: null,
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedFooter: 'Wow! Du hast den Kurs abgeschlossen.',
            condition: 'pupil_conducted_subcourse_appointment > 0',
            conditionDataAggregations: JSON.parse(
                '{"pupil_conducted_subcourse_appointment":{"metric":"pupil_conducted_subcourse_appointment","aggregator":"at_least_one_event_per_bucket","createBuckets":"by_lecture_participation","bucketAggregator":"presence_of_events"}}'
            ),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Match,
            group: 'pupil_match_regular_learning',
            groupOrder: 1,
            sequentialStepName: null,
            type: achievement_type_enum.STREAK,
            title: 'Rhythmus-Rekord',
            tagline: 'Nachhilfe mit {{student.firstname}}',
            description:
                'Um diese Serie aufrechtzuerhalten; setze deine gemeinsamen Lernsessions mit {{name}} weiter fort. Regelmäßiges Lernen bringt eine Fülle an Vorteilen mit sich; von verbessertem Wissen und Verständnis bis hin zu gesteigerter Effizienz und Selbstvertrauen. Ihr seid definitiv auf dem richtigen Weg; um eure Ziele zu erreichen!',
            achievedDescription: null,
            image: 'gamification/achievements/tmp/streaks/regular_learning_set.png',
            achievedImage: 'gamification/achievements/tmp/streaks/regular_learning_achieved.png',
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedFooter: 'Hurra; du erhöhst deinen Rekord weiter!',
            condition: 'pupil_match_learning_events > recordValue',
            conditionDataAggregations: JSON.parse(
                '{"pupil_match_learning_events":{"metric":"pupil_match_learned_regular","aggregator":"last_streak_length","createBuckets":"by_weeks","bucketAggregator":"presence_of_events"}}'
            ),
            isActive: true,
        },
    });

    await prisma.achievement_template.create({
        data: {
            templateFor: achievement_template_for_enum.Global,
            group: 'pupil_appointment_reliability',
            groupOrder: 1,
            sequentialStepName: null,
            type: achievement_type_enum.STREAK,
            title: 'Pünktlichkeits-Power',
            tagline: 'Zur richtigen Uhrzeit',
            description:
                'Halte diesen tollen Trend aufrecht und baue ihn weiter aus. Jedes Mal; wenn du innerhalb der ersten 5 Minuten zum Termin erscheinst; steigt deine Erfolgsstreak. Mit deiner Pünktlichkeit wie ein Uhrwerk bist du auf dem besten Weg zum:r Pünktlichkeits-Meister:in. Weiter so; du bist auf dem richtigen Kurs!',
            achievedDescription: null,
            image: 'gamification/achievements/tmp/streaks/punctuality_set.png',
            achievedImage: 'gamification/achievements/tmp/streaks/punctuality_achieved.png',
            actionName: null,
            actionRedirectLink: null,
            actionType: null,
            achievedFooter: 'Hurra; du erhöhst deinen Rekord weiter!',
            condition: 'pupil_participated_in_meeting > recordValue',
            conditionDataAggregations: JSON.parse(
                '{"pupil_participated_in_meeting":{"metric":"pupil_participated_in_meeting","aggregator":"last_streak_length","createBuckets":"by_lecture_start","bucketAggregator":"presence_of_events"}}'
            ),
            isActive: true,
        },
    });
}
