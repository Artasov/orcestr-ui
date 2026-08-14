import assert from 'node:assert/strict';
import { after, afterEach, test } from 'node:test';

import { setupDom } from '../../test-utils/dom.mts';

const restoreDom = setupDom();
const { cleanup, render, screen } = await import('@testing-library/react');
const { userEvent } = await import('@testing-library/user-event');

afterEach(cleanup);
after(restoreDom);

const { Carousel } = await import('./Carousel.js');

test('supports arrow, dot and keyboard navigation for arbitrary slide content', async () => {
    const user = userEvent.setup();
    render(
        <Carousel aria-label="Demo carousel" testId="carousel">
            <article>First panel</article>
            <article>Second panel</article>
            <article>Third panel</article>
        </Carousel>,
    );

    const first = screen.getByTestId('carousel-slide-0');
    const second = screen.getByTestId('carousel-slide-1');
    assert.equal(first.getAttribute('aria-hidden'), 'false');
    assert.equal(second.getAttribute('aria-hidden'), 'true');

    await user.click(screen.getByRole('button', { name: 'Next slide' }));
    assert.equal(first.getAttribute('aria-hidden'), 'true');
    assert.equal(second.getAttribute('aria-hidden'), 'false');

    await user.click(screen.getByRole('button', { name: 'Go to slide 3 of 3' }));
    assert.equal(screen.getByTestId('carousel-slide-2').getAttribute('aria-hidden'), 'false');

    await user.click(screen.getByRole('region', { name: 'Demo carousel' }));
    await user.keyboard('{Home}');
    assert.equal(first.getAttribute('aria-hidden'), 'false');
});

test('can remove built-in arrows and dots', () => {
    render(
        <Carousel aria-label="Minimal carousel" arrows="never" showDots={false}>
            <div>One</div>
            <div>Two</div>
        </Carousel>,
    );

    assert.equal(screen.queryByRole('button'), null);
});
