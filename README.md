# kkivy

Generates instant view for posts from kknights.com

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Run the project:
   ```bash
   yarn run start
   ```

## Configuration

Set the port for the server to listen on:
```bash
export PORT=your_preferred_port_number
```

## Usage

To generate an instant view:
1. Take any kknights.com post/bonfire URL
2. Replace `kknights.com` with your server's URL
3. Send the modified link to Telegram

Example:
```
https://kknights.com/bonfire/118858 => https://kkivy.darkhole.space/bonfire/118858
```

## Notes & Limitations

1. **Partial Block Support**: Not all block types are supported (mostly embeds). Some can be added - contributions welcome!
2. **API Reliability**: The API sometimes hangs
3. **Telegram Limitations**: Some posts can't be rendered as instant view due to unknown Telegram-side restrictions (possibly total media size limits)
4. **Caching Behavior**: Instant Views don't update automatically. To refresh send link to @WebpageBot.

## Contributing

Contributions to improve block support or fix issues are welcome!