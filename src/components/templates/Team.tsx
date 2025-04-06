import Image from 'next/image';
import Link from 'next/link';
import { JSX } from 'react';

import { Container } from '@/components/layout/Container';
import Crossbar from '@/components/templates/Crossbar';
import Paragraph from '@/components/ui/typography/Paragraph';
import { Title } from '@/components/ui/typography/Title';

interface TeamMember {
  name: string;
  image: string;
  description: string | JSX.Element;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Dr. Jessica Szczuka',
    image: '/images/team/uni-duisburg-essen_dr-jessica-m-szczuka.webp',
    description: (
      <>
        <Paragraph>
          Dr. Jessica Szczuka is the head of the Junior Research Group INTITEC
          (Intimacy with and through Technologies) at the University of
          Duisburg-Essen and a leading researcher in the field of digitized
          intimacy. Her research integrates media, social, and communication
          psychology with Human-Computer Interaction (HCI) to explore the impact
          of digitalization on concepts of love and sexuality.
        </Paragraph>
        <Paragraph>
          She holds a Bachelor’s and Master’s degree in Applied Cognitive and
          Media Science from the University of Duisburg-Essen, where she also
          earned her Ph.D. in Social Psychology with a focus on Media and
          Communication. During her postdoctoral phase, she led the
          psychological research component of the interdisciplinary IMPACT
          project, investigating how individuals communicate with AI systems,
          build relationships, and develop an understanding of them throughout
          their lifespan.
        </Paragraph>
        <Paragraph>
          Even during her doctoral studies, Dr. Szczuka focused on the empirical
          exploration of digital intimacy, particularly how people integrate
          digital technologies into romantic and sexual contexts. Her primary
          goal is to establish a solid scientific foundation for this emerging
          field and to shape public debates on digital intimacy based on
          empirical evidence.
        </Paragraph>
        <Paragraph>
          Through her research group INTITEC, she pursues two core research
          directions:
        </Paragraph>
        <ul>
          <li className='mb-4'>
            • The human perspective: What makes us unique in our interaction
            with machines? What fosters emotional closeness with artificial
            systems? Which aspects of intimacy and social connection remain
            irreplicable by technology?
          </li>
          <li>
            • The technological perspective: What ethical and societal
            frameworks are needed to ensure the responsible development and use
            of digital intimacy technologies?
          </li>
        </ul>
        <Paragraph>
          Additionally, she sees it as her responsibility to empirically address
          potential risks, including privacy concerns in intimate chat
          communication, the societal impact of digital intimacy technologies,
          and the inclusion of vulnerable user groups.
        </Paragraph>
      </>
    ),
  },
  {
    name: 'B. Sc. Anna Straub',
    image: '/images/team/uni-duisburg-essen_anna-straub.webp',
    description: (
      <Paragraph>
        Anna is a student assistant in the SENTIMENT project and is currently
        pursuing a Bachelor’s degree in Applied Cognitive and Media Sciences at
        the University of Duisburg-Essen
      </Paragraph>
    ),
  },
  {
    name: 'M. Sc. Lisa Mühl',
    image: '/images/team/uni-duisburg-essen_lisa-muehl.webp',
    description: (
      <>
        <Paragraph>
          Lisa is a research associate in the SENTIMENT project within the
          psychology division and a Ph.D. candidate in the INTITEC junior
          research group at the University of Duisburg-Essen. She holds a
          bachelor’s degree in Media and Business Psychology and a master’s
          degree in Applied Cognitive and Media Science, an interdisciplinary
          program bridging computer science, psychology, and human-computer
          interaction. Her master’s thesis explored the potential use of
          sexualized technologies for neurodiverse individuals and individuals
          with intellectual and physical disabilities.
        </Paragraph>
        <Paragraph>
          Before starting her Ph.D., Lisa worked as a research associate and
          project manager on various interdisciplinary research projects in the
          fields of affective computing, speech emotion recognition, UX, and
          HCI. Additionally, she worked as a scientific-technical project
          manager on two BMBF-funded research projects at Rheinische Hochschule
          Cologne, focusing on the application of social robots in therapy for
          children with autism spectrum disorder and the AI-based diagnosis of
          PTSD using speech emotion recognition.
        </Paragraph>
        <Paragraph>
          As part of SENTIMENT, her doctoral research investigates intimate
          communication with natural language dialogue systems and the ways
          users engage in self-disclosure with them. Her first study examines
          the role of communication modality (text vs. voice) and the
          perception-behavior gap in information sharing across these contexts.
          The second study explores voice-based interactions in personalized
          dialogues, analyzing the topics users disclose and how their behavior
          evolves over time. Both studies investigate longitudinal changes in
          user interaction patterns.
        </Paragraph>
      </>
    ),
  },
  {
    name: 'Prof. Dr. Veelasha Moonsamy',
    image: '/images/team/uni-bochum_veelasha-moonsamy.webp',
    description: (
      <Paragraph>
        Prof. Dr. Veelasha Moonsamy is a Professor in the Faculty of Computer
        Science at Ruhr University Bochum (Germany), where she leads the{' '}
        <Link
          href='https://informatik.rub.de/ubisys/'
          className='cursor-pointer text-primary underline'
          target='_blank'
        >
          Chair for Security and Privacy of Ubiquitous Systems
        </Link>
        . She is also a member of the Horst Görtz Institute for IT Security and
        a Principal Investigator in the Excellence Cluster CASA. Previously, she
        was affiliated with Radboud University and Utrecht University - both in
        The Netherlands, and obtained her PhD from Deakin University in
        Australia. Her research interests include IoT/mobile/embedded systems,
        data privacy and applications of machine learning for security and
        privacy. She currently serves as Dean of Graduate School in the
        Excellence Cluster CASA, and was Track Chair for ACM CCS 2023. She is
        also the recipient of a Google Faculty Award and Meta Research Award.
      </Paragraph>
    ),
  },
  {
    name: 'M. Sc. Ramya Kandula',
    image: '/images/team/uni-bochum_ramya-kandula.webp',
    description: (
      <Paragraph>
        Ramya Kandula is a PhD student at the{' '}
        <Link
          href='https://informatik.rub.de/ubisys/'
          className='cursor-pointer text-primary underline'
          target='_blank'
        >
          Chair for Security and Privacy of Ubiquitous Systems (UbiSys)
        </Link>{' '}
        at Ruhr University Bochum. She obtained her Master’s degree in
        Interactive Media Technologies at KTH Royal Institute of Technology in
        Sweden. Her focus in the SENTIMENT project is on the exploration of self
        disclosure tendencies in human-chatbot interactions using privacy and
        user-centric lenses. Using privacy-by-design mechanisms and HCI methods,
        she aims to combine computational and psychological aspects of chatbot
        interactions to develop secure self disclosure strategies.
      </Paragraph>
    ),
  },
  {
    name: 'Joel Baumann',
    image: '/images/team/kunsthochschule-kassel_joel-baumann.webp',
    description: 'Research Assistant',
  },
  {
    name: 'Dr. Maxi Nebel',
    image: '/images/team/uni-kassel_maxi-nebel.webp',
    description: (
      <Paragraph>
        Maxi is a researcher in the Research Center for Information Systems
        Design (ITeG) at the University of Kassel. She completed her PhD thesis
        under Prof. Dr. Alexander Roßnagel on privacy protection in social
        networks. She has many years of experience in interdisciplinary research
        projects and conducts research on topics in the fields of data
        (protection) law, technology law and artificial intelligence. She is the
        author of numerous publications. Detailed information is available at{' '}
        <Link
          href='https://goto.uni-kassel.de/go/dr-maxi-nebel'
          className='cursor-pointer text-primary underline'
          target='_blank'
        >
          https://goto.uni-kassel.de/go/dr-maxi-nebel
        </Link>
        .
      </Paragraph>
    ),
  },
  {
    name: 'PD Dr. Christian Geminn',
    image: '/images/team/uni-kassel_christian-geminn.webp',
    description: (
      <Paragraph>
        Christian is a private lecturer for Public Law and Law of the Digital
        Society at the University of Kassel. He is also active as a consultant
        for ministries, non-profit organizations as well as large and small
        companies, and principal investigator in several third-party funded
        research projects. Overall, his research interests focus on fundamental
        rights, comparative law, data protection and governance as well as
        technology law. Detailed information is available at{' '}
        <Link
          href='https://www.uni-kassel.de/go/geminn'
          className='cursor-pointer text-primary underline'
          target='_blank'
        >
          https://www.uni-kassel.de/go/geminn
        </Link>
      </Paragraph>
    ),
  },
];

function TeamHero() {
  return (
    <>
      <Title className='leading-none' size='two'>
        Meet the{' '}
        <span className='font-secondary italic text-primary'>Team</span>
      </Title>
    </>
  );
}

function TeamMembers() {
  return (
    <div className='relative'>
      {teamMembers.map((member) => (
        <div
          key={member.name}
          className='mb-24 grid grid-cols-3 sm:grid-cols-4 sm:gap-x-16'
        >
          <Title
            size='four'
            className='col-span-4 font-primary uppercase sm:text-right'
          >
            {member.name}
          </Title>
          <span className='col-span-4 sm:col-span-2'>{member.description}</span>
          <Image
            src={member.image}
            alt={member.name}
            width={200}
            height={200}
            className='col-span-4 w-full object-cover sm:col-span-2 sm:col-start-3 sm:mt-0 sm:h-[600px]'
          />
        </div>
      ))}
    </div>
  );
}

export default function Team() {
  return (
    <section className='py-24 sm:py-36'>
      <Container>
        <Crossbar />
        <div className='px-2 sm:px-4'>
          <TeamHero />
          <TeamMembers />
        </div>
      </Container>
    </section>
  );
}
