defmodule SignalServerWeb.UserSocket do
  use Phoenix.Socket


  channel "room:*", YourAppWeb.WebRTCCannel

  def id(_socket), do: nil
end
