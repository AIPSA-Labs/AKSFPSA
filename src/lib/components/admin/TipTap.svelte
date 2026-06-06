<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Placeholder from '@tiptap/extension-placeholder';
	import Link from '@tiptap/extension-link';
	import TextAlign from '@tiptap/extension-text-align';
	import {
		Undo2, Redo2, Bold, Italic, Heading2, Heading3, Heading4,
		List, ListOrdered, TextQuote, Code2, Minus, AlignLeft, AlignCenter
	} from '@lucide/svelte';

	let { content = '', onUpdate }: { content?: string; onUpdate?: (html: string) => void } = $props();

	let el: HTMLDivElement;
	let editor: Editor;
	let wrapperEl: HTMLDivElement;
	let actionbarEl: HTMLDivElement;

	onMount(() => {
		editor = new Editor({
			element: el,
			extensions: [
				StarterKit.configure({
					heading: { levels: [2, 3, 4] }
				}),
				Placeholder.configure({ placeholder: 'Start writing...' }),
				Link.configure({ openOnClick: false }),
				TextAlign.configure({ types: ['heading', 'paragraph'] })
			],
			content: content || '<p></p>',
			onUpdate: ({ editor: ed }) => {
				onUpdate?.(ed.getHTML());
			}
		});
	});

	onDestroy(() => {
		editor?.destroy();
	});

	function exec(command: string, val?: string) {
		switch (command) {
			case 'bold': editor.chain().focus().toggleBold().run(); break;
			case 'italic': editor.chain().focus().toggleItalic().run(); break;
			case 'h2': editor.chain().focus().toggleHeading({ level: 2 }).run(); break;
			case 'h3': editor.chain().focus().toggleHeading({ level: 3 }).run(); break;
			case 'h4': editor.chain().focus().toggleHeading({ level: 4 }).run(); break;
			case 'bullet': editor.chain().focus().toggleBulletList().run(); break;
			case 'ordered': editor.chain().focus().toggleOrderedList().run(); break;
			case 'blockquote': editor.chain().focus().toggleBlockquote().run(); break;
			case 'code': editor.chain().focus().toggleCodeBlock().run(); break;
			case 'hr': editor.chain().focus().setHorizontalRule().run(); break;
			case 'undo': editor.chain().focus().undo().run(); break;
			case 'redo': editor.chain().focus().redo().run(); break;
			case 'align-left': editor.chain().focus().setTextAlign('left').run(); break;
			case 'align-center': editor.chain().focus().setTextAlign('center').run(); break;
		}
	}

	function isActive(name: string, attrs?: Record<string, string>) {
		return editor?.isActive(name, attrs) ?? false;
	}
</script>

<div bind:this={wrapperEl} class="tiptap-wrapper">
	<div bind:this={el} class="tiptap-content min-h-[300px]"></div>
</div>
<div bind:this={actionbarEl} class="actionbar flex flex-nowrap gap-0.5 border-t border-border bg-surface p-2 shadow-lg overflow-x-auto">
	<button onclick={() => exec('undo')} class="rounded px-2 py-1 hover:bg-background" title="Undo"><Undo2 size={16} /></button>
	<button onclick={() => exec('redo')} class="rounded px-2 py-1 hover:bg-background" title="Redo"><Redo2 size={16} /></button>
	<span class="mx-1 w-px bg-border"></span>
	<button onclick={() => exec('bold')} class="rounded px-2 py-1 hover:bg-background {isActive('bold') ? 'bg-background' : ''}" title="Bold"><Bold size={16} /></button>
	<button onclick={() => exec('italic')} class="rounded px-2 py-1 hover:bg-background {isActive('italic') ? 'bg-background' : ''}" title="Italic"><Italic size={16} /></button>
	<span class="mx-1 w-px bg-border"></span>
	<button onclick={() => exec('h2')} class="rounded px-2 py-1 hover:bg-background {isActive('heading', { level: '2' }) ? 'bg-background' : ''}" title="Heading 2"><Heading2 size={16} /></button>
	<button onclick={() => exec('h3')} class="rounded px-2 py-1 hover:bg-background {isActive('heading', { level: '3' }) ? 'bg-background' : ''}" title="Heading 3"><Heading3 size={16} /></button>
	<button onclick={() => exec('h4')} class="rounded px-2 py-1 hover:bg-background {isActive('heading', { level: '4' }) ? 'bg-background' : ''}" title="Heading 4"><Heading4 size={16} /></button>
	<span class="mx-1 w-px bg-border"></span>
	<button onclick={() => exec('bullet')} class="rounded px-2 py-1 hover:bg-background {isActive('bulletList') ? 'bg-background' : ''}" title="Bullet List"><List size={16} /></button>
	<button onclick={() => exec('ordered')} class="rounded px-2 py-1 hover:bg-background {isActive('orderedList') ? 'bg-background' : ''}" title="Ordered List"><ListOrdered size={16} /></button>
	<button onclick={() => exec('blockquote')} class="rounded px-2 py-1 hover:bg-background {isActive('blockquote') ? 'bg-background' : ''}" title="Quote"><TextQuote size={16} /></button>
	<button onclick={() => exec('code')} class="rounded px-2 py-1 hover:bg-background {isActive('codeBlock') ? 'bg-background' : ''}" title="Code Block"><Code2 size={16} /></button>
	<button onclick={() => exec('hr')} class="rounded px-2 py-1 hover:bg-background" title="Horizontal Rule"><Minus size={16} /></button>
	<span class="mx-1 w-px bg-border"></span>
	<button onclick={() => exec('align-left')} class="rounded px-2 py-1 hover:bg-background {isActive({ textAlign: 'left' }) ? 'bg-background' : ''}" title="Align Left"><AlignLeft size={16} /></button>
	<button onclick={() => exec('align-center')} class="rounded px-2 py-1 hover:bg-background {isActive({ textAlign: 'center' }) ? 'bg-background' : ''}" title="Align Center"><AlignCenter size={16} /></button>
</div>

<style>
	:global(.tiptap-content) {
		font-size: 0.9375rem;
		line-height: 1.75;
	}
	:global(.ProseMirror),
	:global(.ProseMirror-focused),
	:global(.ProseMirror:focus),
	:global(.ProseMirror:focus-visible) {
		outline: none !important;
		outline-style: none !important;
		box-shadow: none !important;
		-webkit-box-shadow: none !important;
		ring: none !important;
		-webkit-ring: none !important;
	}
	:global(.actionbar) {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 50;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
	}
	:global(.actionbar::-webkit-scrollbar) {
		display: none;
	}
	:global(.actionbar *:focus) {
		outline: none !important;
		box-shadow: none !important;
	}
	:global(.actionbar *:focus-visible) {
		outline: none !important;
		box-shadow: none !important;
	}
	:global(.tiptap-content p) {
		margin-bottom: 0.75rem;
	}
	:global(.tiptap-content h2) {
		font-size: 1.25rem;
		font-weight: 600;
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;
	}
	:global(.tiptap-content h3) {
		font-size: 1.1rem;
		font-weight: 600;
		margin-top: 1.25rem;
		margin-bottom: 0.5rem;
	}
	:global(.tiptap-content h4) {
		font-size: 1rem;
		font-weight: 600;
		margin-top: 1rem;
		margin-bottom: 0.25rem;
	}
	:global(.tiptap-content ul),
	:global(.tiptap-content ol) {
		padding-left: 1.5rem;
		margin-bottom: 0.75rem;
	}
	:global(.tiptap-content li) {
		margin-bottom: 0.25rem;
	}
	:global(.tiptap-content blockquote) {
		border-left: 3px solid var(--color-primary);
		padding-left: 1rem;
		margin: 0.75rem 0;
		font-style: italic;
		color: var(--color-text-muted);
	}
	:global(.tiptap-content pre) {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		padding: 0.75rem 1rem;
		font-size: 0.8125rem;
		overflow-x: auto;
		margin-bottom: 0.75rem;
	}
	:global(.tiptap-content pre code) {
		background: none;
		padding: 0;
	}
	:global(.tiptap-content code) {
		background: var(--color-surface);
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		font-size: 0.8125rem;
	}
	:global(.tiptap-content hr) {
		border: none;
		border-top: 1px solid var(--color-border);
		margin: 1.5rem 0;
	}
	:global(.tiptap-content p.is-editor-empty:first-child::before) {
		color: var(--color-text-muted);
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
		opacity: 0.5;
	}
	:global(.tiptap-content a) {
		color: var(--color-primary);
		text-decoration: underline;
	}
</style>
