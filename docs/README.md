# Documentation

This folder contains all project documentation.

## What Goes Here

- **Spikes**: Research and investigation documents (in `spikes/` folder)
- **Technical decisions**: Why you chose certain approaches
- **API documentation**: If you're building an API
- **Setup guides**: Special setup instructions
- **Meeting notes**: Important decisions from team meetings

## Writing Markdown Files

Markdown (`.md` files) are simple text files that use special formatting. They're easy to read and write.

### Basic Markdown Syntax

#### Headings

```markdown
# Main Heading (H1)
## Section Heading (H2)
### Subsection (H3)
#### Small Heading (H4)
```

#### Text Formatting

```markdown
**Bold text**
*Italic text*
`code text`
```

#### Lists

Unordered list:
```markdown
- Item one
- Item two
- Item three
```

Numbered list:
```markdown
1. First item
2. Second item
3. Third item
```

#### Links

```markdown
[Link text](https://example.com)
```

#### Code Blocks

Use triple backticks for code:

````markdown
```javascript
function hello() {
  console.log('Hello world')
}
```
````

#### Images

```markdown
![Alt text](path/to/image.png)
```

## How to Create a New Markdown File

**Option 1: Using VS Code**
1. Right-click in the `docs` or `docs/spikes` folder
2. Select "New File"
3. Name it with `.md` extension (e.g., `my-document.md`)
4. Start writing using markdown syntax above

**Option 2: Using Terminal**

```bash
touch docs/my-document.md
```

Then open it in your editor.

## Viewing Markdown Files

- **In VS Code**: Right-click the file and select "Open Preview" (or press `Cmd+Shift+V` / `Ctrl+Shift+V`)
- **On GitHub**: Markdown files render automatically when you view them
- **In browser**: Use extensions like "Markdown Viewer" for Chrome/Firefox
