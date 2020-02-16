# Treats CLI

## Config
### Seed File
You can seed your local Treats instance using a `treats_seed.json` file. This file should be located at `~/.treats/treats_seed.json`.

```
{
    "treats": [
        {
            "name": "Tech RSS",
            "config": {
                ...
            }
        }
    ],
}
```

The ID in the database for each Treat will be constructed as `seed_[treat_name]`. Consequently, Treat names in your seed file must be unique.

## Usage

`treats [items [id_treat]]`
Fetch treat items

`treats create {--id_treat_source} {--name treat_name} {--config json_string}`
Create a new treat

`treats list`
List all available treats


