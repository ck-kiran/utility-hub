import React from 'react';
import { render } from '@testing-library/react-native';
import { HelpCategoryItem } from '@/components/help/HelpCategoryItem';

const mockFAQs = [
  { question: 'How do I upload?', answer: 'Tap the upload button.' },
  { question: 'What formats?', answer: 'PDF, JPG, PNG are supported.' },
];

describe('HelpCategoryItem', () => {
  it('renders correctly', () => {
    const { toJSON } = render(
      <HelpCategoryItem
        icon="rocket-outline"
        iconColor="#0066FF"
        iconBackgroundColor="#E6F0FF"
        title="Getting Started"
        faqs={mockFAQs}
      />
    );

    expect(toJSON()).toBeTruthy();
  });

  it('renders with different icon colors', () => {
    const { toJSON } = render(
      <HelpCategoryItem
        icon="warning-outline"
        iconColor="#EF4444"
        iconBackgroundColor="#FEE2E2"
        title="Troubleshooting"
        faqs={mockFAQs}
      />
    );

    expect(toJSON()).toBeTruthy();
  });

  it('renders with empty FAQs', () => {
    const { toJSON } = render(
      <HelpCategoryItem
        icon="help-outline"
        iconColor="#0066FF"
        iconBackgroundColor="#E6F0FF"
        title="Empty Category"
        faqs={[]}
      />
    );

    expect(toJSON()).toBeTruthy();
  });
});
