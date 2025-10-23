import { Video, Quiz } from '../types/learn';

export const videos: Video[] = [
  {
    id: '1',
    title: 'Introduction to Personal Finance',
    description: 'Learn the basics of managing your personal finances, budgeting, and saving strategies.',
    duration: '12:35',
    thumbnail: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'Finance Basics'
  },
  {
    id: '2',
    title: 'Smart Saving Techniques',
    description: 'Discover proven methods to save money effectively and build your emergency fund.',
    duration: '15:20',
    thumbnail: 'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'Savings'
  },
  {
    id: '3',
    title: 'Understanding Investments',
    description: 'A beginner-friendly guide to investment options and building wealth over time.',
    duration: '18:45',
    thumbnail: 'https://images.pexels.com/photos/3943723/pexels-photo-3943723.jpeg?auto=compress&cs=tinysrgb&w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'Investing'
  },
  {
    id: '4',
    title: 'Debt Management Strategies',
    description: 'Learn how to manage and eliminate debt while maintaining financial stability.',
    duration: '14:10',
    thumbnail: 'https://images.pexels.com/photos/6289065/pexels-photo-6289065.jpeg?auto=compress&cs=tinysrgb&w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'Debt Management'
  },
  {
    id: '5',
    title: 'Building Multiple Income Streams',
    description: 'Explore ways to create additional income sources and achieve financial independence.',
    duration: '20:15',
    thumbnail: 'https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg?auto=compress&cs=tinysrgb&w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'Income Growth'
  },
  {
    id: '6',
    title: 'Tax Planning for Beginners',
    description: 'Understand basic tax concepts and learn how to optimize your tax situation.',
    duration: '16:30',
    thumbnail: 'https://images.pexels.com/photos/6863332/pexels-photo-6863332.jpeg?auto=compress&cs=tinysrgb&w=800',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'Taxes'
  }
];

export const quizzes: Quiz[] = [
  {
    videoId: '1',
    questions: [
      {
        id: 'q1-1',
        question: 'What is the recommended percentage of income to save each month?',
        options: ['5-10%', '20-30%', '40-50%', '60-70%'],
        correctAnswer: 1
      },
      {
        id: 'q1-2',
        question: 'What is a budget?',
        options: [
          'A list of expenses only',
          'A plan for spending and saving money',
          'A way to hide money',
          'A type of bank account'
        ],
        correctAnswer: 1
      },
      {
        id: 'q1-3',
        question: 'Which of these is a need, not a want?',
        options: ['Designer clothes', 'Basic groceries', 'Latest smartphone', 'Vacation trip'],
        correctAnswer: 1
      }
    ]
  },
  {
    videoId: '2',
    questions: [
      {
        id: 'q2-1',
        question: 'What is an emergency fund?',
        options: [
          'Money for vacations',
          'Money saved for unexpected expenses',
          'Investment account',
          'Retirement savings'
        ],
        correctAnswer: 1
      },
      {
        id: 'q2-2',
        question: 'How many months of expenses should an emergency fund cover?',
        options: ['1-2 months', '3-6 months', '12-24 months', '36 months'],
        correctAnswer: 1
      },
      {
        id: 'q2-3',
        question: 'Which saving strategy involves paying yourself first?',
        options: [
          'Saving whatever is left at month end',
          'Setting aside money before spending',
          'Only saving bonuses',
          'Waiting for sales to buy things'
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    videoId: '3',
    questions: [
      {
        id: 'q3-1',
        question: 'What does diversification mean in investing?',
        options: [
          'Investing all money in one stock',
          'Spreading investments across different assets',
          'Only investing in real estate',
          'Keeping all money in cash'
        ],
        correctAnswer: 1
      },
      {
        id: 'q3-2',
        question: 'What is compound interest?',
        options: [
          'Interest paid once',
          'Interest earned on interest',
          'Fixed interest rate',
          'No interest'
        ],
        correctAnswer: 1
      },
      {
        id: 'q3-3',
        question: 'Which investment typically has higher risk but potentially higher returns?',
        options: ['Savings account', 'Government bonds', 'Stocks', 'Certificate of deposit'],
        correctAnswer: 2
      }
    ]
  },
  {
    videoId: '4',
    questions: [
      {
        id: 'q4-1',
        question: 'What is the debt snowball method?',
        options: [
          'Paying largest debt first',
          'Paying smallest debt first',
          'Paying only minimum payments',
          'Ignoring debt'
        ],
        correctAnswer: 1
      },
      {
        id: 'q4-2',
        question: 'What is a good debt-to-income ratio?',
        options: ['Above 50%', '36% or less', '75%', '100%'],
        correctAnswer: 1
      },
      {
        id: 'q4-3',
        question: 'Which type of debt should typically be paid off first?',
        options: [
          'Mortgage',
          'Student loans',
          'High-interest credit cards',
          'Car loan'
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    videoId: '5',
    questions: [
      {
        id: 'q5-1',
        question: 'What is passive income?',
        options: [
          'Income from active work',
          'Income requiring little ongoing effort',
          'One-time payment',
          'Salary from job'
        ],
        correctAnswer: 1
      },
      {
        id: 'q5-2',
        question: 'Which is an example of a side hustle?',
        options: [
          'Your main full-time job',
          'Freelancing in spare time',
          'Spending money',
          'Taking vacation'
        ],
        correctAnswer: 1
      },
      {
        id: 'q5-3',
        question: 'Why are multiple income streams important?',
        options: [
          'To work more hours',
          'To reduce financial risk',
          'To avoid saving',
          'To spend more'
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    videoId: '6',
    questions: [
      {
        id: 'q6-1',
        question: 'What is a tax deduction?',
        options: [
          'Money you owe the government',
          'Amount that reduces taxable income',
          'A penalty fee',
          'Extra tax you pay'
        ],
        correctAnswer: 1
      },
      {
        id: 'q6-2',
        question: 'When are annual tax returns typically due?',
        options: [
          'January 1st',
          'April 15th',
          'December 31st',
          'June 30th'
        ],
        correctAnswer: 1
      },
      {
        id: 'q6-3',
        question: 'What is a W-2 form?',
        options: [
          'A tax return',
          'A wage and tax statement from employer',
          'A business license',
          'A savings account'
        ],
        correctAnswer: 1
      }
    ]
  }
];
