## Disable Git operations via HTTP protocol

  - Disable Grack support in `<railsroot>/config/route.rb`.
  - Disable HTTP button in `<railsroot>/app/views/shared/_clone_panel.html.haml`.

## Disable code archive download

  - Remove the `unless` statement in
    `<railsroot>/app/controllers/projects/repositories_controller.rb`.

  - Add `disabled` class attribute to buttons in
    `<railsroot>/app/views/projects/repositories/_download_archive.html.haml`.
    ([ref](https://github.com/gitlabhq/gitlabhq/pull/5969))

Note that if you still want to allow some users to download code, the
`download_code` permission is defined at `<railsroot>/app/models/ability.rb`.

## References

  - Have a look at the [diff](disable-code-download.diff?raw=true) for details.
