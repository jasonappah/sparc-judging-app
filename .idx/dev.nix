# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-23.11"; # see: https://search.nixos.org/packages

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    pkgs.corepack_20
    pkgs.openssl
  ];

  # Sets environment variables in the workspace
  env = {};
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      "eamodio.gitlens"
      "biomejs.biome"
      "dbaeumer.vscode-eslint"
      "ofhumanbondage.react-proptypes-intellisense"
      "mgmcdermott.vscode-language-babel"
      "wix.vscode-import-cost"
      "pflannery.vscode-versionlens"
      "editorconfig.editorconfig"
      "prisma.prisma"
      "graphql.vscode-graphql"
    ];

    # Workspace lifecycle hooks
    workspace = {
      # Runs when a workspace is first created
      onCreate = {
        npm-install = "yarn install";
        install-ni = "yarn i -g @antfu/ni";
      };
    };
  };
}