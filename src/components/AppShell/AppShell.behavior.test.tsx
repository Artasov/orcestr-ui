import assert from 'node:assert/strict';
import {after, afterEach, test} from 'node:test';
import {setupDom} from '../../test-utils/dom.mts';

const restore = setupDom();
const {useState} = await import('react');
const {createPortal} = await import('react-dom');
const {act, cleanup, render, screen, waitFor, fireEvent} = await import('@testing-library/react');
const {userEvent} = await import('@testing-library/user-event');
const {AppShell} = await import('./AppShell.js');
const {AppShellSidebarToggle} = await import('../AppShellSidebarToggle/AppShellSidebarToggle.js');
const {OrcestrUiProvider} = await import('../../provider/OrcestrUiProvider.js');
afterEach(cleanup);
after(restore);

function Harness({mode = 'desktop', side = 'left', preview = true}: {mode?: 'desktop' | 'mobile'; side?: 'left' | 'right'; preview?: boolean}) {
    const [open, setOpen] = useState(false);
    const [count, setCount] = useState(0);
    return <OrcestrUiProvider locale='en'><AppShell sidebarMode={mode} sidebarSide={side} sidebarOpen={open} desktopSidebarOpen={open}
        sidebarHoverPreview={preview} onSidebarOpenChange={setOpen} testId='shell'
        header={<AppShellSidebarToggle aria-label='Menu' />}
        sidebar={<nav><button onClick={() => setCount((n) => n + 1)}>Sidebar action {count}</button>
            {createPortal(<button data-testid='portal-action' onClick={() => setCount((n) => n + 1)}>Portal action</button>, document.body)}
        </nav>}>
        <button>Page action</button>
    </AppShell></OrcestrUiProvider>;
}

for (const side of ['left', 'right'] as const) test(`${side}: hover is interactive without pinning; click pins and survives mouse leave`, async () => {
    const user = userEvent.setup();
    render(<Harness side={side} />);
    const shell = screen.getByTestId('shell'), trigger = screen.getByRole('button', {name: 'Menu'});
    const panel = document.getElementById(trigger.getAttribute('aria-controls')!)!;
    assert.equal(panel.hasAttribute('inert'), true);
    await user.hover(trigger);
    await waitFor(() => assert.equal(shell.getAttribute('data-sidebar-preview'), 'true'));
    assert.equal(shell.getAttribute('data-desktop-sidebar-open'), 'false');
    assert.equal(panel.hasAttribute('inert'), false);
    assert.equal(trigger.getAttribute('aria-expanded'), 'true');
    await user.hover(screen.getByRole('button', {name: 'Sidebar action 0'}));
    await user.click(screen.getByRole('button', {name: 'Sidebar action 0'}));
    assert.ok(screen.getByRole('button', {name: 'Sidebar action 1'}));
    assert.equal(shell.getAttribute('data-desktop-sidebar-open'), 'false');
    await user.click(trigger);
    assert.equal(shell.getAttribute('data-desktop-sidebar-open'), 'true');
    assert.equal(shell.hasAttribute('data-sidebar-preview'), false);
    await user.hover(screen.getByRole('button', {name: 'Page action'}));
    await act(async () => {await new Promise((resolve) => setTimeout(resolve, 260));});
    assert.equal(shell.getAttribute('data-desktop-sidebar-open'), 'true');
    await user.click(trigger);
    assert.equal(shell.getAttribute('data-desktop-sidebar-open'), 'false');
    assert.equal(panel.hasAttribute('inert'), true);
});

test('preview closes after leaving, on outside click and Escape; focus returns to its trigger', async () => {
    const user = userEvent.setup(); render(<Harness />);
    const shell = screen.getByTestId('shell'), trigger = screen.getByRole('button', {name: 'Menu'});
    const open = async () => {await user.hover(trigger); await waitFor(() => assert.equal(shell.getAttribute('data-sidebar-preview'), 'true'));};
    await open();
    await user.hover(screen.getByRole('button', {name: 'Page action'}));
    await waitFor(() => assert.equal(shell.hasAttribute('data-sidebar-preview'), false));
    await open();
    await user.click(screen.getByRole('button', {name: 'Page action'}));
    assert.equal(shell.hasAttribute('data-sidebar-preview'), false);
    await open();
    await user.click(screen.getByRole('button', {name: 'Sidebar action 0'}));
    await user.hover(screen.getByRole('button', {name: 'Page action'}));
    await waitFor(() => assert.equal(shell.hasAttribute('data-sidebar-preview'), false));
    await open();
    await user.click(screen.getByRole('button', {name: 'Sidebar action 1'}));
    await user.keyboard('{Escape}');
    assert.equal(shell.hasAttribute('data-sidebar-preview'), false);
    assert.equal(document.activeElement, trigger);
    assert.equal(shell.getAttribute('data-desktop-sidebar-open'), 'false');
});

test('portaled sidebar controls remain interactive while the sidebar is previewed', async () => {
    const user = userEvent.setup(); render(<Harness />);
    const shell = screen.getByTestId('shell');
    await user.hover(screen.getByRole('button', {name: 'Menu'}));
    await waitFor(() => assert.equal(shell.getAttribute('data-sidebar-preview'), 'true'));
    await user.click(screen.getByTestId('portal-action'));
    await user.hover(screen.getByRole('button', {name: 'Page action'}));
    await act(async () => {await new Promise((resolve) => setTimeout(resolve, 260));});
    assert.equal(shell.getAttribute('data-sidebar-preview'), 'true');
    assert.ok(screen.getByRole('button', {name: 'Sidebar action 1'}));
    await user.click(screen.getByRole('button', {name: 'Page action'}));
    assert.equal(shell.hasAttribute('data-sidebar-preview'), false);
});

test('hover stays opt-in and touch never opens a desktop preview', async () => {
    const user = userEvent.setup();
    const view = render(<Harness preview={false} />);
    await user.hover(screen.getByRole('button', {name: 'Menu'}));
    await act(async () => {await new Promise((resolve) => setTimeout(resolve, 160));});
    assert.equal(screen.getByTestId('shell').hasAttribute('data-sidebar-preview'), false);
    view.rerender(<Harness />);
    fireEvent.pointerEnter(screen.getByRole('button', {name: 'Menu'}), {pointerType: 'touch'});
    await act(async () => {await new Promise((resolve) => setTimeout(resolve, 160));});
    assert.equal(screen.getByTestId('shell').hasAttribute('data-sidebar-preview'), false);
});

test('mobile keeps the existing click-to-open drawer behavior', async () => {
    const user = userEvent.setup(); render(<Harness mode='mobile' />);
    const shell = screen.getByTestId('shell'), trigger = screen.getByRole('button', {name: 'Menu'});
    await user.hover(trigger);
    await act(async () => {await new Promise((resolve) => setTimeout(resolve, 160));});
    assert.equal(shell.hasAttribute('data-sidebar-preview'), false);
    await user.click(trigger);
    assert.equal(shell.getAttribute('data-sidebar-open'), 'true');
    assert.ok(screen.getByRole('button', {name: 'Sidebar action 0'}));
    await user.click(trigger);
    assert.equal(shell.getAttribute('data-sidebar-open'), 'false');
});
