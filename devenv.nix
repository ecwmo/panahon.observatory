{ pkgs, lib, config, inputs, ... }:
let
  # Adding libuuid to some node binaries are required by the
  # "node-canvas" package
  wrapWithMissingLibraries = binaryFile:
    pkgs.writeShellScriptBin (baseNameOf binaryFile) ''
      LD_LIBRARY_PATH="${pkgs.lib.makeLibraryPath [ pkgs.libuuid ]}";
      export LD_LIBRARY_PATH
      exec ${binaryFile} "$@";
    '';
  node = wrapWithMissingLibraries (lib.getExe pkgs.nodejs_22);
  pnpm = wrapWithMissingLibraries (lib.getExe pkgs.pnpm);
in {
  packages = with pkgs; [ git openssl ] ++ [ node pnpm ];

  languages.javascript = {
    enable = true;
    package = node;
    pnpm.enable = true;
    pnpm.package = pnpm;
  };

  enterShell = ''
    pnpm --version
  '';

  enterTest = ''
    pnpm run test:unit
  '';
}
