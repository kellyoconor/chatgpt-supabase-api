# 🧠 AI Knowledge System
### Enterprise-Ready Conversation Archive for ChatGPT + Claude

Transform your AI conversations from lost chat history into a searchable, organized knowledge base. This system captures insights from both ChatGPT Enterprise and Claude Desktop, storing everything in a structured database for long-term reference and analysis.

## ✨ Features

- 🔄 **Dual AI Integration**: Seamlessly capture conversations from both ChatGPT and Claude
- 🏢 **Enterprise Compliant**: Works with ChatGPT Enterprise restrictions via browser extension
- 📊 **Smart Organization**: Auto-categorize by strategy, user feedback, competitive analysis, etc.
- 🎯 **Priority Levels**: Mark conversations as low, medium, high, or critical importance
- 📅 **Time-Based Filtering**: Automatic quarterly tagging for periodic reviews
- 🔍 **Powerful Search**: Query across months of conversations to find patterns and insights
- 🛡️ **Privacy First**: Your data stays in your own Supabase database
- ⚡ **One-Click Save**: Browser extension makes saving ChatGPT conversations effortless

## 🎯 Perfect For

- **Product Managers** building competitive intelligence and user research repositories
- **Consultants** maintaining client insight databases
- **Researchers** organizing AI-assisted analysis sessions
- **Teams** creating shared knowledge bases from AI conversations
- **Anyone** who wants to stop losing valuable AI insights

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Chrome browser
- Supabase account (free tier works)

### 1. Database Setup
```sql
-- Create your conversations table
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  topic VARCHAR(100),
  content TEXT NOT NULL,
  category VARCHAR(50),
  priority VARCHAR(10),
  source VARCHAR(20),
  tags TEXT[],
  conversation_date DATE DEFAULT CURRENT_DATE,
  quarter VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. API Deployment
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

```bash
git clone https://github.com/yourusername/ai-knowledge-system
cd ai-knowledge-system/api-server
npm install
npm start
```

Set environment variables:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

### 3. Browser Extension Setup
1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `browser-extension` folder

### 4. Claude Desktop Integration
Add to `~/.claude/claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "supabase": {
      "command": "node",
      "args": ["/path/to/supabase-mcp/packages/mcp-server-supabase/dist/transports/stdio.js"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "your_token",
        "SUPABASE_URL": "your_url",
        "SUPABASE_ANON_KEY": "your_key",
        "SUPABASE_PROJECT_REF": "your_project"
      }
    }
  }
}
```

## 💡 Usage Examples

### ChatGPT Enterprise
1. Have your conversation normally
2. Click the extension icon
3. Review auto-suggested topic
4. Select category and priority
5. Click "Save Conversation"

### Claude Desktop
```
"Save this strategy conversation with high priority: 
[your conversation content]"

"Show me all user feedback insights from Q1 2025"

"Find high-priority competitive analysis discussions"
```

## 🏗️ Architecture

```
ChatGPT Enterprise → Browser Extension → API Server → Supabase
Claude Desktop → MCP Protocol → Local Server → Supabase
```

### Components
- **Browser Extension**: Captures ChatGPT conversations with enterprise compliance
- **API Server**: Hosted endpoint for saving conversations to database
- **MCP Integration**: Direct Claude Desktop to database connection
- **Supabase Database**: PostgreSQL with structured conversation storage

## 📁 Project Structure

```
ai-knowledge-system/
├── browser-extension/
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   └── content.js
├── api-server/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── mcp-setup/
│   └── claude_desktop_config.json
├── database/
│   └── schema.sql
└── docs/
    └── technical-overview.html
```

## 🔧 Configuration

### Categories
- `strategy` - High-level planning and direction
- `user_feedback` - Customer insights and research
- `competitive_analysis` - Market and competitor research
- `brainstorming` - Creative ideation sessions
- `general` - Miscellaneous conversations

### Priority Levels
- `critical` - Mission-critical insights
- `high` - Important for near-term decisions
- `medium` - Useful reference material
- `low` - Nice-to-have information

## 🛠️ Development

### Local Development
```bash
# API Server
cd api-server
npm install
npm run dev

# Extension Development
# Load unpacked extension in Chrome for hot reloading
```

### Adding Features
- **New Categories**: Update database constraints and extension dropdown
- **Custom Fields**: Extend database schema and forms
- **Integrations**: Add new AI tools following the extension pattern

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Roadmap

- [ ] Slack integration for team sharing
- [ ] Export to PDF/Word reports
- [ ] Advanced analytics dashboard
- [ ] Mobile app for conversation capture
- [ ] Integration with Notion/Obsidian
- [ ] Multi-user support with permissions

## ⚠️ Enterprise Considerations

This system is designed to work within enterprise constraints:
- ✅ No API keys required for ChatGPT Enterprise
- ✅ Data stays in your own database
- ✅ Browser extension uses standard web APIs
- ✅ No external AI service dependencies

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase MCP Community](https://github.com/supabase-community/supabase-mcp) for the foundational MCP server
- [Anthropic](https://anthropic.com) for Claude and MCP protocol
- [OpenAI](https://openai.com) for ChatGPT platform

## 📧 Support

- Create an [issue](https://github.com/yourusername/ai-knowledge-system/issues) for bugs
- Start a [discussion](https://github.com/yourusername/ai-knowledge-system/discussions) for questions
- Follow [@yourusername](https://twitter.com/yourusername) for updates

---

**Built by product managers, for product managers.** 🚀

*Stop losing your best AI insights. Start building your knowledge advantage.*
