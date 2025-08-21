"use client"

import { useCallback, useEffect, useState } from "react"
import { Eye, EyeOff, History, RefreshCw, Shield, Zap } from "lucide-react"

import { getCommonFeatures } from "@/lib/tool-patterns"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { CopyButton, FeatureGrid, ToolLayout } from "@/components/common"

interface PasswordOptions {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  excludeSimilar: boolean
  excludeAmbiguous: boolean
}

interface GeneratedPassword {
  password: string
  timestamp: number
  strength: number
}

export function PasswordGenerator() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(true)
  const [history, setHistory] = useState<GeneratedPassword[]>([])
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false,
  })

  const getCharacterSets = useCallback(() => {
    let chars = ""

    if (options.includeUppercase) {
      chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    }
    if (options.includeLowercase) {
      chars += "abcdefghijklmnopqrstuvwxyz"
    }
    if (options.includeNumbers) {
      chars += "0123456789"
    }
    if (options.includeSymbols) {
      chars += "!@#$%^&*()_+-=[]{}|;:,.<>?"
    }

    // Remove similar characters if option is enabled
    if (options.excludeSimilar) {
      chars = chars.replace(/[il1Lo0O]/g, "")
    }

    // Remove ambiguous characters if option is enabled
    if (options.excludeAmbiguous) {
      chars = chars.replace(/[{}[\]()\/\\'"~,;.<>]/g, "")
    }

    return chars
  }, [options])

  const calculateStrength = useCallback((pwd: string) => {
    let score = 0

    // Length score
    if (pwd.length >= 8) score += 1
    if (pwd.length >= 12) score += 1
    if (pwd.length >= 16) score += 1

    // Character variety score
    if (/[a-z]/.test(pwd)) score += 1
    if (/[A-Z]/.test(pwd)) score += 1
    if (/[0-9]/.test(pwd)) score += 1
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1

    // Bonus for longer passwords
    if (pwd.length >= 20) score += 1

    return Math.min(score, 8)
  }, [])

  const generatePassword = useCallback(() => {
    const chars = getCharacterSets()

    if (!chars) {
      toast({
        title: "No Character Sets",
        description: "Please select at least one character set",
        variant: "destructive",
      })
      return
    }

    let result = ""
    const array = new Uint32Array(options.length)
    crypto.getRandomValues(array)

    for (let i = 0; i < options.length; i++) {
      result += chars.charAt(array[i] % chars.length)
    }

    const strength = calculateStrength(result)
    setPassword(result)

    // Add to history
    const newEntry: GeneratedPassword = {
      password: result,
      timestamp: Date.now(),
      strength,
    }

    setHistory((prev) => [newEntry, ...prev.slice(0, 9)]) // Keep last 10

    toast({
      title: "Password Generated",
      description: `${options.length} character password created`,
    })
  }, [options, getCharacterSets, calculateStrength])

  const getStrengthInfo = (strength: number) => {
    if (strength <= 3)
      return {
        label: "Weak",
        color: "bg-red-500",
        description: "Consider longer password or more character types",
      }
    if (strength <= 5)
      return {
        label: "Fair",
        color: "bg-yellow-500",
        description: "Good but could be stronger",
      }
    if (strength <= 7)
      return {
        label: "Strong",
        color: "bg-green-500",
        description: "Great password!",
      }
    return {
      label: "Very Strong",
      color: "bg-green-600",
      description: "Excellent password security!",
    }
  }

  const clearHistory = () => {
    setHistory([])
    toast({
      title: "History Cleared",
      description: "Password history has been cleared",
    })
  }

  // Generate initial password
  useEffect(() => {
    generatePassword()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  const strengthInfo = password
    ? getStrengthInfo(calculateStrength(password))
    : null
  const estimatedCombinations = Math.pow(
    getCharacterSets().length,
    options.length
  )

  const features = getCommonFeatures([
    "REAL_TIME",
    "CUSTOMIZABLE",
    "COPY_READY",
    "PRIVACY",
  ])

  return (
    <ToolLayout>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Generator */}
        <div className="space-y-6 lg:col-span-2">
          {/* Generated Password */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Generated Password</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={generatePassword}>
                    <RefreshCw className="h-4 w-4" />
                    Generate
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input
                  value={password}
                  readOnly
                  type={showPassword ? "text" : "password"}
                  className="h-12 pr-20 font-mono text-lg"
                />
                <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <CopyButton variant="ghost" text={password} />
                </div>
              </div>

              {/* Strength Indicator */}
              {strengthInfo && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Password Strength
                    </span>
                    <Badge
                      variant="secondary"
                      className={`${strengthInfo.color} text-white`}
                    >
                      {strengthInfo.label}
                    </Badge>
                  </div>
                  <div className="bg-muted h-2 w-full rounded-full">
                    <div
                      className={`h-2 rounded-full ${strengthInfo.color} transition-all duration-300`}
                      style={{
                        width: `${(calculateStrength(password) / 8) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {strengthInfo.description}
                  </p>
                </div>
              )}

              {/* Security Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Length:</span>
                  <span className="ml-2 font-mono">
                    {password.length} characters
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Combinations:</span>
                  <span className="ml-2 font-mono">
                    {estimatedCombinations > 1e12
                      ? `${(estimatedCombinations / 1e12).toFixed(1)}T`
                      : estimatedCombinations.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Password Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Length */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Password Length: {options.length}
                </Label>
                <Slider
                  min={4}
                  max={128}
                  step={1}
                  value={[options.length]}
                  onValueChange={(values) =>
                    setOptions({
                      ...options,
                      length: values[0],
                    })
                  }
                  className="w-full"
                />
                <div className="text-muted-foreground flex justify-between text-xs">
                  <span>4</span>
                  <span>128</span>
                </div>
              </div>

              {/* Character Sets */}
              <div className="space-y-3">
                <h3 className="font-medium">Include Character Types</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="uppercase"
                      checked={options.includeUppercase}
                      onCheckedChange={(checked) =>
                        setOptions({
                          ...options,
                          includeUppercase: !!checked,
                        })
                      }
                    />
                    <Label htmlFor="uppercase" className="text-sm">
                      Uppercase (A-Z)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lowercase"
                      checked={options.includeLowercase}
                      onCheckedChange={(checked) =>
                        setOptions({
                          ...options,
                          includeLowercase: !!checked,
                        })
                      }
                    />
                    <Label htmlFor="lowercase" className="text-sm">
                      Lowercase (a-z)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="numbers"
                      checked={options.includeNumbers}
                      onCheckedChange={(checked) =>
                        setOptions({ ...options, includeNumbers: !!checked })
                      }
                    />
                    <Label htmlFor="numbers" className="text-sm">
                      Numbers (0-9)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="symbols"
                      checked={options.includeSymbols}
                      onCheckedChange={(checked) =>
                        setOptions({ ...options, includeSymbols: !!checked })
                      }
                    />
                    <Label htmlFor="symbols" className="text-sm">
                      Symbols (!@#$...)
                    </Label>
                  </div>
                </div>
              </div>

              {/* Exclusion Options */}
              <div className="space-y-3">
                <h3 className="font-medium">Exclusion Options</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="excludeSimilar"
                      checked={options.excludeSimilar}
                      onCheckedChange={(checked) =>
                        setOptions({ ...options, excludeSimilar: !!checked })
                      }
                    />
                    <Label htmlFor="excludeSimilar" className="text-sm">
                      Exclude similar characters (i, l, 1, L, o, 0, O)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="excludeAmbiguous"
                      checked={options.excludeAmbiguous}
                      onCheckedChange={(checked) =>
                        setOptions({
                          ...options,
                          excludeAmbiguous: !!checked,
                        })
                      }
                    />
                    <Label htmlFor="excludeAmbiguous" className="text-sm">
                      Exclude ambiguous characters (
                      {`{ } [ ] ( ) / \\ ' " ~ , ; . < >`})
                    </Label>
                  </div>
                </div>
              </div>

              <Button onClick={generatePassword} className="w-full">
                <Zap className="h-4 w-4" />
                Generate New Password
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setOptions({ ...options, length: 8, includeSymbols: false })
                  setTimeout(generatePassword, 100)
                }}
              >
                <Shield className="h-4 w-4" />
                Simple (8 chars)
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setOptions({ ...options, length: 16, includeSymbols: true })
                  setTimeout(generatePassword, 100)
                }}
              >
                <Shield className="h-4 w-4" />
                Strong (16 chars)
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setOptions({ ...options, length: 32, includeSymbols: true })
                  setTimeout(generatePassword, 100)
                }}
              >
                <Shield className="h-4 w-4" />
                Ultra Secure (32 chars)
              </Button>
            </CardContent>
          </Card>

          {/* Password History */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <History className="h-4 w-4" />
                  Recent Passwords
                </CardTitle>
                {history.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearHistory}>
                    Clear
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-muted-foreground py-4 text-center text-sm">
                  No recent passwords
                </p>
              ) : (
                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {history.map((item, index) => {
                    const historyStrengthInfo = getStrengthInfo(item.strength)
                    return (
                      <div
                        key={index}
                        className="bg-muted/50 hover:bg-muted rounded border p-2 transition-colors"
                      >
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-muted-foreground text-xs">
                            {new Date(item.timestamp).toLocaleTimeString()}
                          </span>
                          <Badge
                            variant="secondary"
                            className={`text-xs ${historyStrengthInfo.color} text-white`}
                          >
                            {historyStrengthInfo.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 truncate font-mono text-xs">
                            {showPassword ? item.password : "••••••••••••••••"}
                          </code>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setPassword(item.password)}
                              className="h-6 w-6 p-0"
                            >
                              ↑
                            </Button>
                            <CopyButton text={item.password} size="sm" />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Tips */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Security Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Use unique passwords for each account</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Store passwords in a password manager</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Enable two-factor authentication</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-600">✗</span>
                <span>Don&apos;t share passwords via email or text</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <FeatureGrid features={features} />
    </ToolLayout>
  )
}
